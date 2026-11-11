// Constants for JANASEVA AI Platform

export const ROLES = {
  CITIZEN: 'citizen',
  CMO_ADMIN: 'cmo_admin',
  OFFICER: 'officer'
};

export const GRIEVANCE_STATUSES = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  REOPENED: 'Reopened'
};

export const VALID_STATUS_TRANSITIONS = {
  'Submitted': ['Under Review'],
  'Under Review': ['In Progress', 'Resolved'],
  'In Progress': ['Resolved', 'Under Review'],
  'Resolved': ['Reopened'],
  'Reopened': ['Under Review', 'In Progress']
};

export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export const KERALA_DISTRICTS = [
  'Thiruvananthapuram',
  'Kollam',
  'Pathanamthitta',
  'Alappuzha',
  'Kottayam',
  'Idukki',
  'Ernakulam',
  'Thrissur',
  'Palakkad',
  'Malappuram',
  'Kozhikode',
  'Wayanad',
  'Kannur',
  'Kasaragod'
];

export const SLA_HOURS = {
  'Urgent': 24,
  'High': 48,
  'Medium': 96,
  'Low': 168
};

