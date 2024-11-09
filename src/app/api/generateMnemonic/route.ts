import { NextResponse } from 'next/server';
import { Mnemonic } from 'ethers';

/**
 * 니모닉 랜덤 생성
 * 
 * @description 새로운 니모닉을 생성합니다.
 * @returns 생성된 니모닉 문자열
 */
export async function GET() {
  try {
    const mnemonic = Mnemonic.fromEntropy(crypto.getRandomValues(new Uint8Array(32))).phrase;
    return NextResponse.json({ mnemonic });
  } catch (error: unknown) {
    console.error('Error generating mnemonic:', error);
    return NextResponse.json(
      { 
        message: '니모닉 생성 중 오류 발생', 
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}