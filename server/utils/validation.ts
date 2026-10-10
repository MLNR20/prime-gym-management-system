import { Request, Response, NextFunction } from "express";
import { body, validationResult, ValidationChain } from "express-validator";

// Runs after a route's validation chains; rejects the request with the
// collected errors instead of letting the handler run on bad input.
export function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Letters, spaces, hyphens and apostrophes only (e.g. "Mary-Jane", "O'Brien") —
// blocks digits and other special characters in name fields.
const NAME_REGEX = /^[A-Za-z\s'-]+$/;
const NAME_MESSAGE = "Must only contain letters, no numbers or special characters";

// ---------- Auth ----------

export const registerValidation: ValidationChain[] = [
  body("first_name").trim().notEmpty().withMessage("First name is required").matches(NAME_REGEX).withMessage(NAME_MESSAGE),
  body("last_name").trim().notEmpty().withMessage("Last name is required").matches(NAME_REGEX).withMessage(NAME_MESSAGE),
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];

export const loginValidation: ValidationChain[] = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const verifyOtpValidation: ValidationChain[] = [
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("otp").trim().notEmpty().withMessage("Code is required"),
];

export const emailOnlyValidation: ValidationChain[] = [
  body("email").trim().isEmail().withMessage("A valid email is required"),
];

export const resetPasswordValidation: ValidationChain[] = [
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];

// ---------- Contact ----------

export const createContactValidation: ValidationChain[] = [
  body("first_name").trim().notEmpty().withMessage("First name is required").matches(NAME_REGEX).withMessage(NAME_MESSAGE),
  body("last_name").trim().notEmpty().withMessage("Last name is required").matches(NAME_REGEX).withMessage(NAME_MESSAGE),
  body("contact_number").trim().notEmpty().withMessage("Contact number is required"),
  body("role").trim().notEmpty().withMessage("Role is required"),
];

// ---------- Customer ----------

const SUBSCRIPTION_STATUSES = ["Paid", "Expired"];
const PAYMENT_OPTIONS = ["GCash", "Cash"];
const SUBSCRIPTION_TYPES = [
  "Daily Exercise",
  "Monthly Subscription",
  "Coaching Subscription",
  "Monthly with Coaching",
];

export const createCustomerValidation: ValidationChain[] = [
  body("first_name").trim().notEmpty().withMessage("First name is required").matches(NAME_REGEX).withMessage(NAME_MESSAGE),
  body("last_name").trim().notEmpty().withMessage("Last name is required").matches(NAME_REGEX).withMessage(NAME_MESSAGE),
  body("amount_paid").isFloat({ min: 0 }).withMessage("Amount paid must be a positive number"),
  body("contact_no").trim().notEmpty().withMessage("Contact number is required"),
  body("email").optional({ values: "falsy" }).trim().isEmail().withMessage("Invalid email address"),
  body("status").optional().isIn(SUBSCRIPTION_STATUSES).withMessage("Invalid status"),
  body("payment_option").optional().isIn(PAYMENT_OPTIONS).withMessage("Invalid payment option"),
  body("subscription_type").notEmpty().isIn(SUBSCRIPTION_TYPES).withMessage("Invalid subscription type"),
];

export const updateCustomerValidation: ValidationChain[] = [
  body("first_name").optional().trim().notEmpty().withMessage("First name cannot be empty").matches(NAME_REGEX).withMessage(NAME_MESSAGE),
  body("last_name").optional().trim().notEmpty().withMessage("Last name cannot be empty").matches(NAME_REGEX).withMessage(NAME_MESSAGE),
  body("amount_paid").optional().isFloat({ min: 0 }).withMessage("Amount paid must be a positive number"),
  body("contact_no").optional().trim().notEmpty().withMessage("Contact number cannot be empty"),
  body("email").optional({ values: "falsy" }).trim().isEmail().withMessage("Invalid email address"),
  body("status").optional().isIn(SUBSCRIPTION_STATUSES).withMessage("Invalid status"),
  body("payment_option").optional().isIn(PAYMENT_OPTIONS).withMessage("Invalid payment option"),
  body("subscription_type").optional().isIn(SUBSCRIPTION_TYPES).withMessage("Invalid subscription type"),
];

export const updateSubscriptionValidation: ValidationChain[] = [
  body("payment_option").optional().isIn(PAYMENT_OPTIONS).withMessage("Invalid payment option"),
  body("subscription_type").notEmpty().isIn(SUBSCRIPTION_TYPES).withMessage("Invalid subscription type"),
  body("amount_paid").isFloat({ min: 0 }).withMessage("Amount paid must be a positive number"),
];

// ---------- Equipment ----------

const EQUIPMENT_STATUSES = ["Active", "Inactive", "For Repair", "Under Repair"];

export const equipmentValidation: ValidationChain[] = [
  body("equipment_name").trim().notEmpty().withMessage("Equipment name is required"),
  body("equipment_status").optional().isIn(EQUIPMENT_STATUSES).withMessage("Invalid equipment status"),
];

// ---------- Exercise ----------

const TARGET_AREAS = [
  "Chest", "Legs", "Biceps", "Triceps", "Shoulders", "Abs", "Back",
  "Forearms", "Calves", "Glutes", "Obliques", "Traps", "Lats", "FullBody",
];

export const createExerciseValidation: ValidationChain[] = [
  body("exercise_name").trim().notEmpty().withMessage("Exercise name is required"),
  body("target_area").notEmpty().isIn(TARGET_AREAS).withMessage("Invalid target area"),
  body("reps").isInt({ min: 1 }).withMessage("Reps must be a positive integer"),
  body("sets").isInt({ min: 1 }).withMessage("Sets must be a positive integer"),
];

export const updateExerciseValidation: ValidationChain[] = [
  body("exercise_name").optional().trim().notEmpty().withMessage("Exercise name cannot be empty"),
  body("target_area").optional().isIn(TARGET_AREAS).withMessage("Invalid target area"),
  body("reps").optional().isInt({ min: 1 }).withMessage("Reps must be a positive integer"),
  body("sets").optional().isInt({ min: 1 }).withMessage("Sets must be a positive integer"),
];

// ---------- Expense ----------

const EXPENSE_CATEGORIES = [
  "Rent", "Utilities", "Wages", "Equipment", "Maintenance", "Supplies", "Miscellaneous",
];

export const createExpenseValidation: ValidationChain[] = [
  body("expense_title").trim().notEmpty().withMessage("Expense title is required"),
  body("unit_price").isFloat({ min: 0 }).withMessage("Unit price must be a positive number"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
  body("categories").notEmpty().isIn(EXPENSE_CATEGORIES).withMessage("Invalid category"),
  body("due_date").notEmpty().isISO8601().withMessage("Due date must be a valid date"),
];

export const updateExpenseValidation: ValidationChain[] = [
  body("expense_title").optional().trim().notEmpty().withMessage("Expense title cannot be empty"),
  body("unit_price").optional().isFloat({ min: 0 }).withMessage("Unit price must be a positive number"),
  body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
  body("categories").optional().isIn(EXPENSE_CATEGORIES).withMessage("Invalid category"),
  body("due_date").optional().isISO8601().withMessage("Due date must be a valid date"),
];

// ---------- Inventory ----------

const INVENTORY_CATEGORIES = [
  "Equipment", "Supplements", "Apparel", "Accessories", "Cleaning Supplies", "Miscellaneous",
];
const INVENTORY_STATUSES = ["Available", "Low Stock", "Out of Stock", "Discontinued"];

export const createInventoryValidation: ValidationChain[] = [
  body("item_name").trim().notEmpty().withMessage("Item name is required"),
  body("item_code").trim().notEmpty().withMessage("Item code is required"),
  body("category").notEmpty().isIn(INVENTORY_CATEGORIES).withMessage("Invalid category"),
  body("quantity").isInt({ min: 0 }).withMessage("Quantity must be zero or a positive integer"),
  body("unit_price").isFloat({ min: 0 }).withMessage("Unit price must be a positive number"),
  body("status").optional().isIn(INVENTORY_STATUSES).withMessage("Invalid status"),
  body("is_for_sale").optional().isBoolean().withMessage("is_for_sale must be true or false"),
];

export const updateInventoryValidation: ValidationChain[] = [
  body("item_name").optional().trim().notEmpty().withMessage("Item name cannot be empty"),
  body("item_code").optional().trim().notEmpty().withMessage("Item code cannot be empty"),
  body("category").optional().isIn(INVENTORY_CATEGORIES).withMessage("Invalid category"),
  body("quantity").optional().isInt({ min: 0 }).withMessage("Quantity must be zero or a positive integer"),
  body("unit_price").optional().isFloat({ min: 0 }).withMessage("Unit price must be a positive number"),
  body("status").optional().isIn(INVENTORY_STATUSES).withMessage("Invalid status"),
  body("is_for_sale").optional().isBoolean().withMessage("is_for_sale must be true or false"),
];

// ---------- Locker ----------

export const createLockerValidation: ValidationChain[] = [
  body("lockerNumber").notEmpty().isInt({ min: 1 }).withMessage("Locker number must be a positive integer"),
];

export const updateLockerValidation: ValidationChain[] = [
  body("locker_number").optional().isInt({ min: 1 }).withMessage("Locker number must be a positive integer"),
  body("is_active").optional().isBoolean().withMessage("is_active must be true or false"),
];

// ---------- Program ----------

export const createProgramValidation: ValidationChain[] = [
  body("program_name").trim().notEmpty().withMessage("Program name is required"),
  body("description").optional().trim(),
  body("date_assigned").optional().isISO8601().withMessage("Date assigned must be a valid date"),
];

export const updateProgramValidation: ValidationChain[] = [
  body("program_name").optional().trim().notEmpty().withMessage("Program name cannot be empty"),
  body("description").optional().trim(),
  body("date_assigned").optional().isISO8601().withMessage("Date assigned must be a valid date"),
];

export const assignExerciseToProgramValidation: ValidationChain[] = [
  body("exercise_id").trim().notEmpty().withMessage("exercise_id is required"),
];

export const assignCustomerToProgramValidation: ValidationChain[] = [
  body("customer_id").trim().notEmpty().withMessage("customer_id is required"),
];

// ---------- Sales ----------

export const createSalesValidation: ValidationChain[] = [
  body("customer_id").trim().notEmpty().withMessage("customer_id is required"),
  body("inventory_id").trim().notEmpty().withMessage("inventory_id is required"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
];

export const updateSalesValidation: ValidationChain[] = [
  body("customer_id").optional().trim().notEmpty().withMessage("customer_id cannot be empty"),
  body("inventory_id").optional().trim().notEmpty().withMessage("inventory_id cannot be empty"),
  body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
];

// ---------- Session / Session Assignment ----------

export const assignSessionValidation: ValidationChain[] = [
  body("customer_id").trim().notEmpty().withMessage("customer_id is required"),
];

export const createSessionAssignmentValidation: ValidationChain[] = [
  body("customer_id").trim().notEmpty().withMessage("customer_id is required"),
  body("program_id").trim().notEmpty().withMessage("program_id is required"),
];
