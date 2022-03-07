import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { createMockedFunction } from 'matchstick-as/assembly/index'
import { GOLDFINCH_CONFIG_ADDRESS, POOL_TOKENS_ADDRESS, ReserveDenominatorConfigIndex, SENIOR_POOL_ADDRESS } from '../src/constants'

export function mockTranchedPoolCalls(
  tranchedPoolAddress: Address,
  creditLineAddress: Address,
  jrPrincipalDeposited: string = "5000000000000"
): void {
  const seniorId = ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1))
  const juniorId = ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(2))
  const defaultPrincipalDeposited = ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))
  const defaultPrincipalSharePrice = ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))
  const defaultInterestSharePrice = ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))
  const lockedUntil = ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1635209769))
  const interestSharePrice = ethereum.Value.fromUnsignedBigInt(BigInt.fromString("9611500737600000"))
  const principalDeposited = ethereum.Value.fromUnsignedBigInt(BigInt.fromString(jrPrincipalDeposited))
  const principalSharePrice = ethereum.Value.fromUnsignedBigInt(BigInt.fromString("736000000"))

  const juniorFeePercent = ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(20))
  const reserveDenominator = ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(10))
  const estimatedSeniorPoolContribution = ethereum.Value.fromUnsignedBigInt(BigInt.fromString("15000000000000"))

  createMockedFunction(
    tranchedPoolAddress,
    "getTranche",
    "getTranche(uint256):((uint256,uint256,uint256,uint256,uint256))"
  )
  .withArgs([ethereum.Value.fromI32(1)])
  .returns([
    ethereum.Value.fromTuple(changetype<ethereum.Tuple>([
      seniorId,
      defaultPrincipalDeposited,
      defaultPrincipalSharePrice,
      defaultInterestSharePrice,
      lockedUntil,
    ]))
  ])

  createMockedFunction(
    tranchedPoolAddress,
    "getTranche",
    "getTranche(uint256):((uint256,uint256,uint256,uint256,uint256))"
  )
  .withArgs([ethereum.Value.fromI32(2)])
  .returns([
    ethereum.Value.fromTuple(changetype<ethereum.Tuple>([
      juniorId,
      principalDeposited,
      principalSharePrice,
      interestSharePrice,
      lockedUntil,
    ]))
  ])
  createMockedFunction(
    tranchedPoolAddress,
    "juniorFeePercent",
    "juniorFeePercent():(uint256)"
  )
  .withArgs([])
  .returns([juniorFeePercent])

  createMockedFunction(
    Address.fromString(GOLDFINCH_CONFIG_ADDRESS),
    "getNumber",
    "getNumber(uint256):(uint256)"
  )
  .withArgs([ethereum.Value.fromI32(ReserveDenominatorConfigIndex)])
  .returns([reserveDenominator])

  createMockedFunction(
    Address.fromString(SENIOR_POOL_ADDRESS),
    "estimateInvestment",
    "estimateInvestment(address):(uint256)"
  )
  .withArgs([ethereum.Value.fromAddress(tranchedPoolAddress)])
  .returns([estimatedSeniorPoolContribution])

  createMockedFunction(
    tranchedPoolAddress,
    "paused",
    "paused():(bool)"
  )
  .withArgs([])
  .returns([ethereum.Value.fromBoolean(false)])

  createMockedFunction(
    tranchedPoolAddress,
    "creditLine",
    "creditLine():(address)"
  )
  .withArgs([])
  .returns([ethereum.Value.fromAddress(creditLineAddress)])

  mockCreditLineContractCalls(creditLineAddress)
}

export function mockCreditLineContractCalls(creditLineAddress: Address, defaultBalance: string = "4999999996320"): void {
  const balance = ethereum.Value.fromUnsignedBigInt(BigInt.fromString(defaultBalance))
  const interestApr = ethereum.Value.fromUnsignedBigInt(BigInt.fromString("130000000000000000"))
  const interestAccruedAsOf = ethereum.Value.fromUnsignedBigInt(BigInt.fromString("1637515148"))
  const paymentPeriodInDays = ethereum.Value.fromUnsignedBigInt(BigInt.fromString("30"))
  const termInDays = ethereum.Value.fromUnsignedBigInt(BigInt.fromString("730"))
  const nextDueTime = ethereum.Value.fromUnsignedBigInt(BigInt.fromString("1640107148"))
  const limit = ethereum.Value.fromUnsignedBigInt(BigInt.fromString("5000000000000"))
  const interestOwed = ethereum.Value.fromUnsignedBigInt(BigInt.fromString("0"))
  const termEndTime = ethereum.Value.fromUnsignedBigInt(BigInt.fromString("1697995148"))
  const lastFullPaymentTime = ethereum.Value.fromUnsignedBigInt(BigInt.fromString("1637515148"))

  createMockedFunction(
    creditLineAddress,
    "balance",
    "balance():(uint256)"
  )
  .withArgs([])
  .returns([balance])
  createMockedFunction(
    creditLineAddress,
    "interestApr",
    "interestApr():(uint256)"
  )
  .withArgs([])
  .returns([interestApr])
  createMockedFunction(
    creditLineAddress,
    "interestAccruedAsOf",
    "interestAccruedAsOf():(uint256)"
  )
  .withArgs([])
  .returns([interestAccruedAsOf])
  createMockedFunction(
    creditLineAddress,
    "paymentPeriodInDays",
    "paymentPeriodInDays():(uint256)"
  )
  .withArgs([])
  .returns([paymentPeriodInDays])
  createMockedFunction(
    creditLineAddress,
    "termInDays",
    "termInDays():(uint256)"
  )
  .withArgs([])
  .returns([termInDays])
  createMockedFunction(
    creditLineAddress,
    "nextDueTime",
    "nextDueTime():(uint256)"
  )
  .withArgs([])
  .returns([nextDueTime])
  createMockedFunction(
    creditLineAddress,
    "limit",
    "limit():(uint256)"
  )
  .withArgs([])
  .returns([limit])
  createMockedFunction(
    creditLineAddress,
    "interestOwed",
    "interestOwed():(uint256)"
  )
  .withArgs([])
  .returns([interestOwed])
  createMockedFunction(
    creditLineAddress,
    "termEndTime",
    "termEndTime():(uint256)"
  )
  .withArgs([])
  .returns([termEndTime])
  createMockedFunction(
    creditLineAddress,
    "lastFullPaymentTime",
    "lastFullPaymentTime():(uint256)"
  )
  .withArgs([])
  .returns([lastFullPaymentTime])

}


export function mockPoolBackersContractCalls(
  tranchedPoolAddress: Address,
  tokenId: BigInt,
  defaultRedeemable: string = '100000'
): void {
  const interestRedeemable = ethereum.Value.fromUnsignedBigInt(BigInt.fromString(defaultRedeemable))
  const principalRedeemable = ethereum.Value.fromUnsignedBigInt(BigInt.fromString(defaultRedeemable))
  createMockedFunction(
    tranchedPoolAddress,
    "availableToWithdraw",
    "availableToWithdraw(uint256):(uint256,uint256)"
  )
  .withArgs([ethereum.Value.fromSignedBigInt(tokenId)])
  .returns([interestRedeemable, principalRedeemable])
}

export function mockTranchedPoolTokenContractCalls(
  tokenId: BigInt,
  tranchedPoolAddress: Address,
  owner: Address,
  defaultPrincipalRedeemed: string = "0"
): void {
  const tranche = ethereum.Value.fromUnsignedBigInt(BigInt.fromString('2'))
  const principalAmount = ethereum.Value.fromUnsignedBigInt(BigInt.fromString('5000000000000'))
  const principalRedeemed = ethereum.Value.fromUnsignedBigInt(BigInt.fromString(defaultPrincipalRedeemed))
  const interestRedeemed = ethereum.Value.fromUnsignedBigInt(BigInt.fromString('0'))

  createMockedFunction(
    Address.fromString(POOL_TOKENS_ADDRESS),
    "getTokenInfo",
    "getTokenInfo(uint256):((address,uint256,uint256,uint256,uint256))"
  )
  .withArgs([ethereum.Value.fromSignedBigInt(tokenId)])
  .returns([
    ethereum.Value.fromTuple(changetype<ethereum.Tuple>([
      ethereum.Value.fromAddress(tranchedPoolAddress),
      tranche,
      principalAmount,
      principalRedeemed,
      interestRedeemed,
    ]))
  ])
  createMockedFunction(
    Address.fromString(POOL_TOKENS_ADDRESS),
    "ownerOf",
    "ownerOf(uint256):(address)"
  )
  .withArgs([ethereum.Value.fromSignedBigInt(tokenId)])
  .returns([ethereum.Value.fromAddress(owner)])

  mockPoolBackersContractCalls(tranchedPoolAddress, tokenId)
}