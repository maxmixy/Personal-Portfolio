import { NextResponse } from "next/server";
import { getCurrentLibraryUser } from "../../../lib/auth";
import { LoanError, updateLoanAsOwner, type LoanAction } from "../../../lib/loans";

interface RouteContext {
  params: Promise<{ loanId: string }>;
}

const LOAN_ACTIONS = new Set<LoanAction>(["approve", "reject", "hand-over", "return"]);

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getCurrentLibraryUser();
  if (!user || user.role !== "owner") {
    return NextResponse.json({ error: "Only the library owner can update loan requests." }, { status: 403 });
  }

  try {
    const { loanId: rawLoanId } = await context.params;
    const loanId = Number(rawLoanId);
    const payload = (await request.json()) as {
      action?: unknown;
      expectedReturnAt?: unknown;
      ownerNote?: unknown;
    };
    const rawAction = typeof payload.action === "string" ? payload.action : "";
    if (!Number.isInteger(loanId) || loanId < 1 || !LOAN_ACTIONS.has(rawAction as LoanAction)) {
      return NextResponse.json({ error: "Choose a valid loan action." }, { status: 400 });
    }
    const action = rawAction as LoanAction;
    const expectedReturnAt = typeof payload.expectedReturnAt === "string" && payload.expectedReturnAt
      ? new Date(payload.expectedReturnAt)
      : null;
    const ownerNote = typeof payload.ownerNote === "string" ? payload.ownerNote.trim() || null : null;
    const status = await updateLoanAsOwner(loanId, action, expectedReturnAt, ownerNote);
    return NextResponse.json({ status });
  } catch (error) {
    const message = error instanceof LoanError ? error.message : "The loan could not be updated.";
    return NextResponse.json({ error: message }, { status: error instanceof LoanError ? 400 : 500 });
  }
}
