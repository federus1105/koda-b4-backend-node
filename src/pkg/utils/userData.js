import { getPrisma } from '../../pkg/libs/prisma.js';
const prisma = getPrisma();


export async function getAndValidateUserData(userID, input) {
  if (input.email && input.fullname && input.address && input.phone) {
    return input;
  }
  const user = await prisma.account.findUnique({
    where: { id: userID },
    select: {
      fullname: true,
      address: true,
      phoneNumber: true,
    user: { 
        select: { email: true }
      }
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const email = input.email?.trim() || user.user?.email;
  const fullname = input.fullname?.trim() || user.fullname;
  const address = input.address?.trim() || user.address;
  const phone = input.phone?.trim() || user.phoneNumber;

  // --- VALIDASI FIELD Wajib ---
  const errors = [];
  if (!email) errors.push({ msg: "Email is required", param: "email", location: "body" });
  if (!fullname) errors.push({ msg: "Fullname is required", param: "fullname", location: "body" });
  if (!address) errors.push({ msg: "Address is required", param: "address", location: "body" });
  if (!phone) errors.push({ msg: "Phone is required", param: "phone", location: "body" });

  if (errors.length > 0) {
    const err = new Error("Validation failed");
    err.errors = errors;
    throw err;
  }

  return { email, fullname, address, phone };
}
