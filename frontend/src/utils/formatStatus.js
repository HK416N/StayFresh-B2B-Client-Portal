// translates TRANSIT status to IN TRANSIT for dipslay
export const formatStatus = (status) => {
  if (status === 'TRANSIT') return 'IN TRANSIT';
  return status;
};