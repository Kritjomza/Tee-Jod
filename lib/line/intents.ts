export type ParkingIntent="parking"|"help";
const parkingKeywords=["parking","park","ที่จอด","จอดรถ","ว่าง","fibo","สนามกีฬา","อาคารจอดรถ"];
export function parseParkingIntent(text:string):ParkingIntent{ const normalized=text.trim().toLocaleLowerCase("th-TH"); return parkingKeywords.some((keyword)=>normalized.includes(keyword))?"parking":"help"; }
