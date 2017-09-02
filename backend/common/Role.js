const Role = {
  Admin: 'admin',
  Standard: 'standard'
};

module.exports = {
  Admin: Role.Admin,
  Standard: Role.Standard,
  ALL: [Role.Admin, Role.Standard]
};
