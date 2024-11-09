'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Wallet } from 'ethers';

export default function Home() {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [addresses, setAddresses] = useState<{ index: number; address: string }[]>([]);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [addressCount, setAddressCount] = useState<number>(0);

  /**
   * 설정된 니모닉으로 ESN 주소 생성
   * 
   * @description 새로운 암호화폐 주소를 생성합니다.
   */
  const handleGenerateAddresses = async () => {
    const newCount = addressCount + 10;
    setAddressCount(newCount);
    try {
      const response = await fetch('/api/generateAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mnemonic, count: newCount }),
      });
      const data = await response.json();
      if (response.ok) {
        setAddresses(data.addresses);
      } else {
        toast.error('유효하지 않은 니모닉입니다. 24단어인지 확인해주세요.');
      }
    } catch (err) {
      toast.error('주소 생성 중 오류가 발생했습니다.2');
      console.error(err);
    }
  };

  const handleLoadMoreAddresses = () => {
    handleGenerateAddresses();
  };

  /**
   * 니모닉 랜덤 생성
   * 
   * @description 새로운 니모닉을 생성합니다.
   */
  const handleGenerateRandomMnemonic = async () => {
    setAddressCount(0);
    try {
      const response = await fetch('/api/generateMnemonic', {
        method: 'GET',
      });
      const data = await response.json();
      if (response.ok) {
        setMnemonic(data.mnemonic);
        const addressResponse = await fetch('/api/generateAddress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mnemonic: data.mnemonic }),
        });
        const addressData = await addressResponse.json();
        if (addressResponse.ok) {
          setAddresses(addressData.addresses);
        } else {
          toast.error(addressData.message || '주소 생성 중 오류가 발생했습니다.');
        }
      } else {
        toast.error(data.message || '니모닉 생성 중 오류가 발생했습니다.');
      }
    } catch (err) {
      toast.error('니모닉 생성 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  /**
   * 설정된 암호로 해당 주소에 해당하는 JSON 지갑 파일을 다운로드 합니다.
   * 
   * @description 지갑파일은 메타마스크,마이이더월렛 형식으로 저장됩니다.
   * @param index - 생성할 주소의 인덱스 (기본값: 0)
   */
  const handleDownloadKeystore = async (index: number = 0) => {
    if (!mnemonic) {
      toast.error('니모닉이 필요합니다.');
      return;
    }
    if (!password) {
      toast.error('비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/getPrivateKey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mnemonic, index }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      const wallet = new Wallet(data.privateKey);
      
      const encryptedWallet = await wallet.encrypt(password);
      const keystoreJson = JSON.parse(encryptedWallet);

      const blob = new Blob([JSON.stringify(keystoreJson, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `UTC--${new Date().toISOString()}--${wallet.address}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      toast.error('키스토어 파일 생성 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-8 py-8 max-w-5xl">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#F44336',
            color: '#fff',
          },
        }}
      />
      <h1 className="text-3xl font-bold text-center mb-8">ESN BIP44 주소 생성기</h1>
      <p className="text-center text-gray-600 mb-6">
        derivation path: m/44&apos;/31102&apos;/0&apos;/0 Ethersocial Network ESN
      </p>
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="24단어 니모닉을 입력하세요" 
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[500px]"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="키스토어 비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleGenerateRandomMnemonic}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              랜덤 니모닉 생성
            </button>
            <button 
              onClick={handleGenerateAddresses}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              입력된 니모닉으로 주소 생성
            </button>
          </div>
        </div>
        <ul className="space-y-2">
          {addresses.map((addr) => (
            <li 
              key={addr.index}
              className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
            >
              <span>{`Address ${addr.index}: ${addr.address}`}</span>
              <div className="flex gap-2">
                <a
                  href={`https://swap.ethersocial.org/api/py/snapshot_python/account?address=${addr.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  주소 확인
                </a>
                <button
                  onClick={() => handleDownloadKeystore(addr.index)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                >
                  키스토어 다운로드
                </button>
              </div>
            </li>
          ))}
        </ul>
        {addresses.length > 0 && (
          <button 
            onClick={handleLoadMoreAddresses}
            className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            더 보기
          </button>
        )}
      </div>
    </div>
  );
} 