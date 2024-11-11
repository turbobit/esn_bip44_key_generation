import { NextResponse } from 'next/server';
import { Mnemonic } from 'ethers';

/**
 * 니모닉 랜덤 생성 API 엔드포인트
 * 
 * @description 지정된 단어 수에 따라 새로운 니모닉 문구를 생성합니다.
 * @param {Request} request - HTTP 요청 객체
 * @param {URLSearchParams} request.searchParams - URL 검색 매개변수
 * @param {string} [request.searchParams.wordCount=24] - 생성할 니모닉 단어 수 (12, 15, 18, 21, 24)
 * @returns {Promise<NextResponse>} 생성된 니모닉 문구와 단어 수를 포함한 JSON 응답
 * @throws {Error} 유효하지 않은 단어 수이거나 생성 중 오류 발생 시
 */
export async function GET(request: Request) {
  try {
    // URL에서 wordCount 파라미터를 가져옴 (기본값 24)
    const { searchParams } = new URL(request.url);
    const wordCount = parseInt(searchParams.get('wordCount') || '24');
    
    // 유효한 단어 수인지 확인
    if (![12, 15, 18, 21, 24].includes(wordCount)) {
      return NextResponse.json(
        { message: '유효하지 않은 단어 수입니다. 12, 15, 18, 21, 24 중 하나를 선택하세요.' },
        { status: 400 }
      );
    }

    // wordCount에 따른 엔트로피 크기 계산 (기본값은 32 bytes로 24단어 생성)
    const entropyBytes = Math.floor(wordCount * 4 / 3);
    
    const mnemonic = Mnemonic.fromEntropy(crypto.getRandomValues(new Uint8Array(entropyBytes))).phrase;
    return NextResponse.json({ mnemonic, wordCount });
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