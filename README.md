# ESN BIP44 주소 생성기

이 프로젝트는 다양한 API 엔드포인트를 통해 암호화폐 관련 기능을 제공합니다. 
- 랜덤 니모닉을 생성(24단어)
- 설정된 니모닉으로 ESN 주소 생성
- 설정된 암호로 해당 주소에 해당하는 JSON 지갑 파일을 다운로드 합니다. 
- 지갑파일은 메타마스크,마이이더월렛 형식으로 저장됩니다.
- https://wallet.gonspool.com/#view-wallet-info 에서도 사용가능합니다.

## API 엔드포인트

### 1. 니모닉 랜덤 생성
- **경로**: `src/app/api/generateMnemonic/route.ts`
- **설명**: 새로운 니모닉을 생성합니다.

### 2. 설정된 니모닉으로 ESN 주소 생성
- **경로**: `src/app/api/generateAddress/route.ts`
- **설명**: 새로운 암호화폐 주소를 생성합니다.

### 3. 설정된 암호로 해당 주소에 해당하는 JSON 지갑 파일을 다운로드 합니다. 
- **경로**: `src/app/api/getPrivateKey/route.ts`
- **설명**: 개인 키를 생성합니다.

## 사용된 라이브러리

- **ethers.js**: 암호화폐 관련 기능을 제공하는 라이브러리로, `node_modules/.pnpm/ethers@6.13.4/node_modules/ethers/src.ts/ethers.ts`에서 사용됩니다.

## 시작하기

```bash
pnpm dev
```

## 기여

기여를 원하신다면, 이 저장소를 포크하고 풀 리퀘스트를 보내주세요.
