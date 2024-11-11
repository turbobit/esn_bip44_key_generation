import { ethers } from 'ethers';
import { NextResponse } from 'next/server';

/**
 * 설정된 암호로 해당 주소에 해당하는 JSON 지갑 파일을 다운로드 합니다.
 * 
 * @description 개인 키를 생성합니다.
 * @param request - 니모닉과 인덱스가 포함된 요청
 * @returns 생성된 개인키
 */
export async function POST(request: Request) {
  try {
    const { mnemonic, index, basePath } = await request.json();
    
    const path = `${basePath}/${index}`;
    const mnemonicObj = ethers.Mnemonic.fromPhrase(mnemonic);
    const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonicObj, path);

    return NextResponse.json({ privateKey: wallet.privateKey });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: '개인키 생성 중 오류가 발생했습니다.' }, { status: 400 });
  }
}