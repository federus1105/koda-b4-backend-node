import { getPrisma } from '../pkg/libs/prisma.js';
const prisma = getPrisma();

export async function UpdateProfile(userId, input) {
  return prisma.$transaction(async (tx) => {

    const account = await tx.account.findFirst({
      where: { id_users: userId }
    });

     if (!account) return null;

    // --- FIELD ACCOUNT ---
    const accountUpdate = {};

    if (input.fullname !== undefined) {
      accountUpdate.fullname = input.fullname;
    }

    if (input.phone !== undefined && input.phone !== "") {
      accountUpdate.phoneNumber = input.phone;
    }

    if (input.address !== undefined) {
      accountUpdate.address = input.address;
    }

    if (input.photosStr !== undefined) {
      accountUpdate.photos = input.photosStr;
    }


    // ---- UPDATE TABLE ACCOUNT ----
    if (Object.keys(accountUpdate).length > 0) {
      await tx.account.update({
        where: { id: account.id },
        data: accountUpdate,
      });
    }


    // --- UPDATE EMAIL ---
    if (input.email !== undefined) {
      await tx.users.update({
        where: { id: userId },
        data: { email: input.email },
      });
    }


    // --- GET DATA ---
    const updated = await tx.account.findFirst({
      where: { id_users: userId },
      include: {
        user: true,
      },
    });

    if (!updated || !updated.user) return null;

    return {
      id: updated.user.id,
      email: updated.user.email,
      fullname: updated.fullname ?? "",
      phone: updated.phoneNumber ?? "",
      address: updated.address ?? "",
      photosStr: updated.photos ?? "",
    };
  });
}

