export function generateContractId() {
  return `contract-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function saveContractToLocalStorage(contractData: any) {
  const contracts = JSON.parse(localStorage.getItem('contracts') || '[]');
  contracts.push(contractData);
  localStorage.setItem('contracts', JSON.stringify(contracts));
}
