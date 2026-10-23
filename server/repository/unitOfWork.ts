import mongoose, { ClientSession } from "mongoose";
import customerRepository, { CustomerRepository } from "./customerRepository";
import equipmentRepository, { EquipmentRepository } from "./equipmentRepository";
import lockerRepository, { LockerRepository } from "./lockerRepository";
import lockerAssignmentRepository, { LockerAssignmentRepository } from "./lockerAssignmentRepository";
import inventoryRepository, { InventoryRepository } from "./inventoryRepository";
import subscriptionHistoryRepository, { SubscriptionHistoryRepository } from "./subscriptionhistoryRepository";
import sessionRepository, { SessionRepository } from "./sessionRepository";
import sessionAssignmentRepository, { SessionAssignmentRepository } from "./sessionAssignmentRepository";
import salesRepository, { SalesRepository } from "./salesRepository";
import programRepository, { ProgramRepository } from "./programRepository";

export interface Repositories {
  customers: CustomerRepository;
  equipment: EquipmentRepository;
  lockers: LockerRepository;
  lockerAssignments: LockerAssignmentRepository;
  inventory: InventoryRepository;
  subscriptionHistory: SubscriptionHistoryRepository;
  sessions: SessionRepository;
  sessionAssignments: SessionAssignmentRepository;
  sales: SalesRepository;
  programs: ProgramRepository;
}

export interface IUnitOfWork extends Repositories {
  /**
   * Runs `work` in a single transaction: every repository handed to the callback
   * shares one session, so the writes commit together or not at all.
   */
  run<T>(work: (repositories: Repositories) => Promise<T>): Promise<T>;
}

const defaultRepositories: Repositories = {
  customers: customerRepository,
  equipment: equipmentRepository,
  lockers: lockerRepository,
  lockerAssignments: lockerAssignmentRepository,
  inventory: inventoryRepository,
  subscriptionHistory: subscriptionHistoryRepository,
  sessions: sessionRepository,
  sessionAssignments: sessionAssignmentRepository,
  sales: salesRepository,
  programs: programRepository,
};

// Transactions need a replica set or mongos. A standalone mongod (such as the
// one in docker-compose) rejects them, so we detect that once and run without.
let transactionsSupported = true;

const isTransactionUnsupported = (error: unknown): boolean => {
  const { code, message } = error as { code?: number; message?: string };
  return code === 20 && /Transaction numbers are only allowed/.test(message ?? "");
};

export class UnitOfWork implements IUnitOfWork {
  readonly customers: CustomerRepository;
  readonly equipment: EquipmentRepository;
  readonly lockers: LockerRepository;
  readonly lockerAssignments: LockerAssignmentRepository;
  readonly inventory: InventoryRepository;
  readonly subscriptionHistory: SubscriptionHistoryRepository;
  readonly sessions: SessionRepository;
  readonly sessionAssignments: SessionAssignmentRepository;
  readonly sales: SalesRepository;
  readonly programs: ProgramRepository;

  constructor(repositories: Repositories = defaultRepositories) {
    this.customers = repositories.customers;
    this.equipment = repositories.equipment;
    this.lockers = repositories.lockers;
    this.lockerAssignments = repositories.lockerAssignments;
    this.inventory = repositories.inventory;
    this.subscriptionHistory = repositories.subscriptionHistory;
    this.sessions = repositories.sessions;
    this.sessionAssignments = repositories.sessionAssignments;
    this.sales = repositories.sales;
    this.programs = repositories.programs;
  }

  private bindTo(session: ClientSession): Repositories {
    return {
      customers: this.customers.withSession(session),
      equipment: this.equipment.withSession(session),
      lockers: this.lockers.withSession(session),
      lockerAssignments: this.lockerAssignments.withSession(session),
      inventory: this.inventory.withSession(session),
      subscriptionHistory: this.subscriptionHistory.withSession(session),
      sessions: this.sessions.withSession(session),
      sessionAssignments: this.sessionAssignments.withSession(session),
      sales: this.sales.withSession(session),
      programs: this.programs.withSession(session),
    };
  }

  async run<T>(work: (repositories: Repositories) => Promise<T>): Promise<T> {
    if (!transactionsSupported) return work(this);

    const session = await mongoose.startSession();
    try {
      let result!: T;
      await session.withTransaction(async () => {
        result = await work(this.bindTo(session));
      });
      return result;
    } catch (error) {
      if (!isTransactionUnsupported(error)) throw error;

      // Rejected on the first operation, before anything was written.
      transactionsSupported = false;
      console.warn("MongoDB transactions are unavailable (not a replica set); running without one.");
      return work(this);
    } finally {
      await session.endSession();
    }
  }
}

export default new UnitOfWork();
