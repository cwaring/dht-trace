import bs58 from "bs58";
import multihashing from 'multihashing-async';
import BigNumber from 'bignumber.js';

export const bs58Decode = (id) => bs58.decode(id)

export const toDhtKey = (buff) => multihashing.digest(buff, 'sha2-256')

export const makePeer = async (b58, isSelf) => {
  const buff = await toDhtKey(bs58Decode(b58))
  const num = BigNumber('0x' + buff.toString('hex'))
  return {
    b58,
    num,
    isSelf
  }
}
