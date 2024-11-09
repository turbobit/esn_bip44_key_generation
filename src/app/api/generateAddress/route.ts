import { ethers } from 'ethers';
import { NextResponse } from 'next/server';

/**
 * 설정된 니모닉으로 ESN 주소 생성
 * 
 * @description 새로운 암호화폐 주소를 생성합니다.
 * @param request - 니모닉과 생성할 주소 개수를 포함한 요청 객체
 * @returns 생성된 주소 목록
 */
export async function POST(request: Request) {
  try {
    const { mnemonic, count } = await request.json();
    
    const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
    const addresses = [];

    for (let i = 0; i < count; i++) {
      const path = `44'/31102'/0'/0/${i}`;
      const wallet = hdNode.derivePath(path);
      addresses.push({ index: i, address: wallet.address });
    }
    
    return NextResponse.json({ addresses });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: '주소 생성 중 오류가 발생했습니다.' }, { status: 400 });
  }
} 