export const formatCurrency = (amount: number, currency: string = '₹'): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${currency}0`;
  }
  
  // Format with commas
  const parts = Math.abs(amount).toFixed(0).split('.');
  let integerPart = parts[0];
  
  // If Indian Rupee, format using Indian number system (1,20,000)
  if (currency === '₹') {
    let lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  } else {
    // Standard international (120,000)
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  const sign = amount < 0 ? '-' : '';
  return `${sign}${currency}${integerPart}`;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const getCategoryColor = (categoryName: string): string => {
  const map: Record<string, string> = {
    Food: '#f59e0b',
    Travel: '#06b6d4',
    Shopping: '#ec4899',
    Bills: '#ef4444',
    Education: '#8b5cf6',
    Health: '#10b981',
    Entertainment: '#6366f1',
    Salary: '#10b981',
    Freelance: '#3b82f6',
    Investments: '#8b5cf6',
  };
  return map[categoryName] || '#64748b';
};
