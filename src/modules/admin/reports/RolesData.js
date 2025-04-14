import { faker } from "@faker-js/faker";

function createRoles() {
  return {
    id: faker.datatype.uuid(),
    title: faker.lorem.words(),
    name: faker.name.findName(),
    description: faker.lorem.sentence(),
  };
}

function createRoles() {
  let Roles = [];

  for (let id = 1; id <= 100; id++) {
    holidays.push(createRoles());
  }

  return Roles;
}

const tableData = createRoles();

export { tableData };
