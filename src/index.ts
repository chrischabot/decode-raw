#!/usr/bin/env node

import { ethers } from 'ethers';

interface DecodedTransaction {
  type?: bigint;
  chainId?: bigint;
  nonce?: bigint;
  maxPriorityFeePerGas?: bigint;
  maxFeePerGas?: bigint;
  gasPrice?: bigint;
  gasLimit?: bigint;
  to?: string;
  value?: bigint;
  data?: string;
  accessList?: Array<{ address: string; storageKeys: string[] }>;
  v?: number;
  r?: string;
  s?: string;
  from?: string;
  hash?: string;
  // Custom fields for internal transactions
  internalTXType?: number;
  nominator?: string;
  nominee?: string;
  stake?: string;
  timestamp?: number;
}

function decodeRawTransaction(rawTx: string): DecodedTransaction {
  // Remove the 0x prefix if present
  const cleanRawTx = rawTx.startsWith('0x') ? rawTx.slice(2) : rawTx;
  
  try {
    // First try to parse as a standard transaction
    const tx = ethers.Transaction.from(rawTx);
    
    const result: DecodedTransaction = {
      type: tx.type ? BigInt(tx.type) : undefined,
      chainId: tx.chainId ? BigInt(tx.chainId) : undefined,
      nonce: BigInt(tx.nonce),
      gasLimit: tx.gasLimit,
      to: tx.to ?? undefined,
      value: tx.value,
      data: tx.data,
      from: tx.from ?? undefined,
      hash: tx.hash ?? undefined
    };

    // Add type-specific fields
    const txType = tx.type ? BigInt(tx.type) : 0n;
    if (txType === 2n) { // EIP-1559
      result.maxPriorityFeePerGas = tx.maxPriorityFeePerGas ?? undefined;
      result.maxFeePerGas = tx.maxFeePerGas ?? undefined;
    } else if (txType === 1n) { // EIP-2930
      result.gasPrice = tx.gasPrice ?? undefined;
      result.accessList = tx.accessList?.map(item => ({
        address: item.address,
        storageKeys: item.storageKeys
      }));
    } else { // Legacy
      result.gasPrice = tx.gasPrice ?? undefined;
    }

    // Add signature fields if they exist
    if (tx.signature) {
      result.v = tx.signature.v;
      result.r = tx.signature.r;
      result.s = tx.signature.s;
    }

    return result;
  } catch (error) {
    // If standard transaction parsing fails, try to parse as internal transaction
    try {
      const decoded = ethers.decodeRlp(cleanRawTx);
      
      if (!Array.isArray(decoded) || decoded.length < 1) {
        throw new Error('Invalid transaction data');
      }

      const firstElement = decoded[0];
      if (typeof firstElement === 'string') {
        const txData = JSON.parse(firstElement);
        return {
          internalTXType: txData.internalTXType,
          nominator: txData.nominator,
          nominee: txData.nominee,
          stake: txData.stake,
          timestamp: txData.timestamp
        };
      } else {
        throw new Error('Invalid transaction data format');
      }
    } catch (innerError) {
      throw new Error('Failed to decode transaction: Not a valid standard or internal transaction');
    }
  }
}

// Custom replacer function to handle BigInt serialization
function jsonReplacer(_key: string, value: any): any {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

// Get the raw transaction from command line arguments
const rawTx = process.argv[2];

if (!rawTx) {
  console.error('Please provide a raw transaction string');
  process.exit(1);
}

try {
  const decoded = decodeRawTransaction(rawTx);
  console.log(JSON.stringify(decoded, jsonReplacer, 2));
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Error decoding transaction:', error.message);
  } else {
    console.error('Error decoding transaction: Unknown error');
  }
  process.exit(1);
} 