-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "registrationNo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capacityKg" REAL NOT NULL,
    "odometerKm" REAL NOT NULL,
    "fuelStatusPct" REAL NOT NULL DEFAULT 100.0,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "acquisitionCost" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "licenseNo" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "licenseExpiry" DATETIME NOT NULL,
    "contact" TEXT NOT NULL,
    "safetyScore" REAL NOT NULL DEFAULT 100.0,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE'
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "cargoWeightKg" REAL NOT NULL,
    "plannedDistanceKm" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "revenue" REAL NOT NULL DEFAULT 0.0,
    CONSTRAINT "Trip_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Trip_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MaintenanceLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "cost" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT "MaintenanceLog_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FuelLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "liters" REAL NOT NULL,
    "cost" REAL NOT NULL,
    CONSTRAINT "FuelLog_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT,
    "vehicleId" TEXT NOT NULL,
    "tollCost" REAL NOT NULL DEFAULT 0.0,
    "otherCost" REAL NOT NULL DEFAULT 0.0,
    CONSTRAINT "Expense_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_registrationNo_key" ON "Vehicle"("registrationNo");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_licenseNo_key" ON "Driver"("licenseNo");
