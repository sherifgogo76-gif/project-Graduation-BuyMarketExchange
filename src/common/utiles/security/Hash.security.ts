import { compare, hash } from "bcrypt"



export const GenerateHash = async (
    palintext: string,
    salt_round: number = parseInt(process.env.SALT as string)
): Promise<string> => {
    return await hash(palintext, salt_round)
}

export const CompareHash = async (
    palintext: string,
    hashvalue: string
): Promise<boolean> => {
    return await compare(palintext, hashvalue)
}
