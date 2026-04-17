"use server";

import { neon } from "@neondatabase/serverless";

const getDb = () => {
  const url = process.env.DATABASE_URL_SECOND;
  if (!url) throw new Error("DATABASE_URL_SECOND is not configured.");
  return neon(url);
};

export async function submitFeedbackAction(data: {
  category: "Blogs" | "Projects" | "Portfolio Website";
  projectName: "Kosha" | "MScada" | null;
  name: string;
  githubId: string;
  email: string;
  feedback: string;
}) {
  try {
    const sql = getDb();

    const finalProjectName =
      data.category === "Projects" ? data.projectName : null;
    const finalGithubId =
      data.githubId.trim() === "" ? null : data.githubId.trim();

    await sql`
      INSERT INTO user_feedback (
        name, email, github_id, category, project_name, feedback_content
      ) VALUES (
        ${data.name}, ${data.email}, ${finalGithubId},
        ${data.category}, ${finalProjectName}, ${data.feedback}
      )
    `;

    return { success: true };
  } catch (error: unknown) {
    console.error("submitFeedbackAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to submit feedback.",
    };
  }
}

export async function getFeedbacksAction() {
  try {
    const sql = getDb();

    // BEST PRACTICE: Strict filtering at the database level.
    // Never send unapproved or non-Kosha data over the network to this specific dashboard.
    const data = await sql`
      SELECT
        id,
        name,
        email,
        github_id,
        category,
        project_name,
        feedback_content AS feedback,
        created__at      AS created_at,
        status,
        reviewed_at
      FROM user_feedback
      WHERE status = 'approved' AND project_name = 'Kosha'
      ORDER BY created__at DESC
    `;

    return { success: true, data };
  } catch (error: unknown) {
    console.error("getFeedbacksAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch feedbacks.",
      data: [],
    };
  }
}
