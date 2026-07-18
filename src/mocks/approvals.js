export const mockApprovals = [
  {
    id: 'REQ-2043',
    type: 'Quotation',
    title: 'Enterprise license tier quotation',
    requester: {
      name: 'Priya Sharma',
      role: 'Sales Manager',
      team: 'North Region',
      avatar: 'PS'
    },
    amount: '₹4,50,000',
    currentValue: '10%',
    requestedValue: '18%',
    age: '2d ago',
    isOverdue: true,
    priority: 'high',
    status: 'pending',
    dateRaised: '14 Jul 2026',
    reason: 'Client is comparing us with competitor X who offered a flat 15%. Given the strategic importance of this account, requesting an additional 8% discount.',
    impact: {
      margin: '18% → 11%',
      warning: 'Below floor price by ₹4,200'
    },
    chain: [
      { role: 'Coordinator', name: 'Rahul K', timestamp: '14 Jul 2026, 10:30 AM', comment: 'Drafted proposal with base discount.' },
      { role: 'Manager', name: 'Priya Sharma', timestamp: '14 Jul 2026, 14:15 PM', comment: 'Endorsed. Escalating for Head approval due to margin impact.' }
    ]
  },
  {
    id: 'REQ-2044',
    type: 'Target change',
    title: 'Q3 Quota adjustment',
    requester: {
      name: 'Amit Patel',
      role: 'Sales Manager',
      team: 'West Region',
      avatar: 'AP'
    },
    amount: '₹12,00,000',
    currentValue: '₹50,00,000',
    requestedValue: '₹38,00,000',
    age: '5h ago',
    isOverdue: false,
    priority: 'medium',
    status: 'pending',
    dateRaised: '16 Jul 2026',
    reason: 'Two key team members on extended leave, reducing overall capacity for the quarter.',
    impact: {
      margin: 'N/A',
      warning: null
    },
    chain: [
      { role: 'Manager', name: 'Amit Patel', timestamp: '16 Jul 2026, 09:00 AM', comment: 'Submitted target revision request.' }
    ]
  },
  {
    id: 'REQ-2045',
    type: 'Lead reassignment',
    title: 'Transfer TechCorp account',
    requester: {
      name: 'Sneha Gupta',
      role: 'Sales Coordinator',
      team: 'South Region',
      avatar: 'SG'
    },
    amount: '₹8,50,000',
    currentValue: 'Owner: Raj',
    requestedValue: 'Owner: Sneha',
    age: '1d ago',
    isOverdue: false,
    priority: 'low',
    status: 'pending',
    dateRaised: '15 Jul 2026',
    reason: 'Raj is moving to a different territory. Taking over this account as per Manager direction.',
    impact: {
      margin: 'N/A',
      warning: null
    },
    chain: [
      { role: 'Coordinator', name: 'Sneha Gupta', timestamp: '15 Jul 2026, 11:00 AM', comment: 'Requested transfer.' },
      { role: 'Manager', name: 'David Lee', timestamp: '15 Jul 2026, 12:30 PM', comment: 'Approved at Manager level.' }
    ]
  },
  {
    id: 'REQ-2046',
    type: 'Discount',
    title: 'Bulk order discount (15%)',
    requester: {
      name: 'Rohan Mehta',
      role: 'Sales Exec',
      team: 'East Region',
      avatar: 'RM'
    },
    amount: '₹24,50,000',
    currentValue: '10%',
    requestedValue: '15%',
    age: '4d ago',
    isOverdue: false,
    priority: 'high',
    status: 'approved',
    dateRaised: '12 Jul 2026',
    reason: 'Client is placing a massive order for 3 warehouses. Need 15% discount to close.',
    impact: { margin: '22% → 17%', warning: null },
    chain: [
      { role: 'Manager', name: 'Sanjay Kumar', timestamp: '13 Jul 2026', comment: 'Approved.' }
    ]
  },
  {
    id: 'REQ-2047',
    type: 'Expense',
    title: 'Client entertainment budget',
    requester: {
      name: 'Neha Singh',
      role: 'Sales Manager',
      team: 'South Region',
      avatar: 'NS'
    },
    amount: '₹45,000',
    currentValue: '₹20,000',
    requestedValue: '₹45,000',
    age: '1w ago',
    isOverdue: false,
    priority: 'low',
    status: 'rejected',
    dateRaised: '08 Jul 2026',
    reason: 'Hosting an exclusive dinner for top 5 prospects.',
    impact: { margin: 'N/A', warning: 'Exceeds monthly limit' },
    chain: [
      { role: 'Head', name: 'Sarah Head', timestamp: '09 Jul 2026', comment: 'Budget exhausted for this quarter. Rejected.' }
    ]
  }
];
