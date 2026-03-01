"use client";
import { useState, useCallback, useRef } from "react";
import { AgentResult, NodeStatus, AppView, TrackerEntry } from "@/lib/types";
import { streamAnalysis, completeTask, generateEmail, sendEmail, fetchTracker, AnalyzeParams } from "@/lib/api";

const NODE_ORDER = [
    "intake",
    "optimize_cv",
    "ats",
    "market",
    "routing",
    "email",
    "gap_analysis",
    "task_plan",
];
const NODE_LABELS: Record<string, string> = {
    intake: "📋 Reading your profile",
    optimize_cv: "✨ Optimizing your CV for ATS",
    ats: "🔍 Scoring your CV against ATS",
    market: "🌍 Searching Tunisian job market",
    routing: "⚡ Determining your strategy",
    email: "✉️ Generating application email",
    gap_analysis: "📊 Analyzing skill gaps",
    task_plan: "📅 Building your action plan",
};

function initialNodes(): NodeStatus[] {
    return NODE_ORDER.map((id) => ({
        id,
        label: NODE_LABELS[id],
        status: "pending" as const,
    }));
}

export function useAgent() {
    const [view, setView] = useState<AppView>("home");
    const [result, setResult] = useState<AgentResult | null>(null);
    const [nodes, setNodes] = useState<NodeStatus[]>(initialNodes());
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [xpTotal, setXpTotal] = useState(0);
    const [tracker, setTracker] = useState<TrackerEntry[]>([]);
    const abortRef = useRef<(() => void) | null>(null);

    const refreshTracker = useCallback(async () => {
        try {
            const entries = await fetchTracker();
            setTracker(entries);
        } catch {
            // Silently fail — tracker is non-critical
        }
    }, []);

    const analyze = useCallback((params: AnalyzeParams) => {
        if (abortRef.current) abortRef.current();
        setView("analyzing");
        setNodes(initialNodes());
        setProgress(0);
        setResult(null);
        setError(null);

        abortRef.current = streamAnalysis(
            params,
            (node, label, prog) => {
                setProgress(prog);
                setNodes((prev) =>
                    prev.map((n) => {
                        if (n.id === node)
                            return {
                                ...n,
                                status: "complete" as const,
                                timestamp: new Date().toLocaleTimeString(),
                            };
                        const nodeIndex = NODE_ORDER.indexOf(node);
                        const nIndex = NODE_ORDER.indexOf(n.id);
                        if (nIndex === nodeIndex + 1)
                            return { ...n, status: "active" as const };
                        return n;
                    })
                );
            },
            (agentResult) => {
                setResult(agentResult);
                setNodes((prev) =>
                    prev.map((n) => ({ ...n, status: "complete" as const }))
                );
                setProgress(100);
                setView("results");
            },
            (err) => {
                setError(err);
                setView("error");
            }
        );
    }, []);

    const completeTaskAction = useCallback(
        async (
            taskId: number,
            skillAdded: string | null,
            xpValue: number,
            currentCv: string
        ) => {
            if (!result) return null;
            const res = await completeTask({
                task_id: taskId,
                skill_added: skillAdded,
                xp_value: xpValue,
                current_cv: currentCv,
                job_matches: result.job_matches,
                student_skills: result.student_profile.skills,
            });
            setXpTotal((prev) => prev + xpValue);
            if (res.new_scores) {
                setResult((prev) => {
                    if (!prev) return prev;
                    const updatedJobs = prev.job_matches.map(
                        (job) => {
                            const newScore = res.new_scores.find(
                                (s: any) => s.job_id === job.job_id
                            );
                            return newScore
                                ? { ...job, match_score: newScore.new_score }
                                : job;
                        }
                    );
                    // Update cv_optimized with the backend-revised version
                    const updatedCvOptimized = res.updated_cv || prev.cv_optimized;
                    // Mark the task as completed in the task_plan
                    const updatedTaskPlan = prev.task_plan.map((t) =>
                        t.id === taskId ? { ...t, completed: true } : t
                    );
                    return {
                        ...prev,
                        job_matches: updatedJobs,
                        cv_optimized: updatedCvOptimized,
                        task_plan: updatedTaskPlan,
                    };
                });
            }
            return res;
        },
        [result]
    );

    const reset = useCallback(() => {
        if (abortRef.current) abortRef.current();
        setView("home");
        setResult(null);
        setNodes(initialNodes());
        setProgress(0);
        setError(null);
    }, []);

    const triggerEmail = useCallback(async (params: any) => {
        const emailBody = await generateEmail(params);
        if (emailBody && emailBody.application_email) {
            setResult((prev) => prev ? { ...prev, application_email: emailBody.application_email } : null);
        }
    }, [])

    return {
        view,
        result,
        nodes,
        progress,
        error,
        xpTotal,
        tracker,
        analyze,
        completeTaskAction,
        triggerEmail,
        refreshTracker,
        reset,
    };
}
