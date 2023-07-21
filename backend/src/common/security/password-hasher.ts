import * as bcrypt from "bcrypt";
import { v4, v5 } from "uuid";

export const generateSuccinct = (val1: string, val2: string) => {
  const passCombination = `${val1}./${val2}`;
  return passCombination;
}

export const generatePassword = async (userId: string, clearPassword: string) => {
  const saltRounds = 10;

  const passCombination = generateSuccinct(userId, clearPassword);
  const password = await bcrypt.hash(passCombination, saltRounds);
  return password;
}

export const comparePassword = async (encripedPassWord: string, clearPassWord: string) => {
  return await bcrypt.compare(clearPassWord, encripedPassWord);
};

export const createTemporaryPassCode = () => {
  const code = v4();
  return code.toString().split("-")[ 0 ];
}


export const generatePgKey = (uuid: string, name: string) => {
  return v5(name, uuid);
}

export function generateCode(): string {

  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const codeLength = Math.floor(Math.random() * 4) + 5; // Random length between 5 and 8

  let code = '';
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[ randomIndex ];
  }

  return code;
}

export function generateCodeFromUUID(uuid: string): string {

  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    const charCode = uuid.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash &= hash; // Convert to 32-bit integer
  }

  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

  let code = '';
  for (let i = 0; i < 8; i++) {
    const charIndex = Math.abs(hash % characters.length);
    code += characters.charAt(charIndex);
    hash = Math.floor(hash / characters.length);
  }

  return code;
}