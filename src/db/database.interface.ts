export interface DatabaseInterface {
  createUser(userId: number, time: string): Promise<void>;
  updateUser(userId: number, time: string): void;
  deleteUser(userId: number): Promise<void>;
}
