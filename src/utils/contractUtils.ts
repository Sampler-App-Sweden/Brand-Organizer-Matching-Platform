import type { Contract } from '../types'

export function generateContractId() {
  return `contract-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function saveContractToLocalStorage(contractData: Contract) {
  const contracts = JSON.parse(
    localStorage.getItem('contracts') || '[]'
  ) as Contract[]
  contracts.push(contractData)
  localStorage.setItem('contracts', JSON.stringify(contracts))
}
