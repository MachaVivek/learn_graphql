-- AlterTable
ALTER TABLE "users" ALTER COLUMN "profile_image_url" DROP NOT NULL,
ALTER COLUMN "profile_image_url" SET DEFAULT 'https://img.freepik.com/premium-vector/social-media-logo_1305298-29989.jpg?semt=ais_hybrid&w=740';
