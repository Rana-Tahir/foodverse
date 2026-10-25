export async function checkAccess(
  userRole: string | null,
  requiredRoles: string[]
): Promise<boolean> {
  if (!userRole) return false;
  return requiredRoles.includes(userRole);
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}
