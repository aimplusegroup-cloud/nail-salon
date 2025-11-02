-- CreateIndex
CREATE INDEX "Reservation_serviceId_idx" ON "Reservation"("serviceId");

-- CreateIndex
CREATE INDEX "Reservation_staffId_idx" ON "Reservation"("staffId");

-- CreateIndex
CREATE INDEX "Reservation_customerId_idx" ON "Reservation"("customerId");
