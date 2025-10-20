-- CreateTable
CREATE TABLE "MLModel" (
    "modelId" TEXT NOT NULL,
    "experimentId" TEXT NOT NULL,
    "RunId" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "kserveEndpoint" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "token" TEXT
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "secret" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MLModel_modelId_key" ON "MLModel"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "MLModel_kserveEndpoint_key" ON "MLModel"("kserveEndpoint");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "MLModel" ADD CONSTRAINT "MLModel_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
