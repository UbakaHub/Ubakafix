type PermitType = 'New' | 'Renovation' | 'Extension'; // extend as needed

export const documentRequirements: Record<string, Record<PermitType, string[]>> = {
  'Category 1': {
    New: [], // No documents required
    Renovation: [], 
    Extension: []
  },
  'Category 2': {
    New: ['Land Title', 'Site Plan', 'Building Drawings'],
    Renovation: ['Renovation Plan', 'Existing Structure Photos'],
    Extension: ['Extension Plan', 'Original Permit']
  },
  'Category 3': {
    New: ['Land Title', 'Environmental Impact Assessment', 'Architectural Drawings', 'Structural Report'],
    Renovation: ['Renovation Plan', 'Fire Safety Clearance'],
    Extension: ['Extension Plan', 'Original Building Permit']
  }
};
