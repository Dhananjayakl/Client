import { faker } from "@faker-js/faker";

function createRandomDocument() {
  return {
    id: faker.datatype.uuid(),
    title: faker.company.name(),
    name: faker.company.name(),
    descripition: faker.finance.account(),
  };
}

function createRandomDocuments() {
  let users = [];

  for (let id = 1; id <= 100; id++) {
    users.push(createRandomDocument());
  }

  return users;
}

const tableData = createRandomDocuments();

export { tableData };
