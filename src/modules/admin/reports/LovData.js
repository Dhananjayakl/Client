import { faker } from "@faker-js/faker";

function createLov() {
  return {
    id: faker.datatype.uuid(),
    title: faker.lorem.words(),
    name: faker.name.findName(),
    description: faker.lorem.sentence(),
  };
}

function createLov() {
  let Lov = [];

  for (let id = 1; id <= 100; id++) {
    holidays.push(createLov());
  }

  return Lov;
}

const tableData = createLov();

export { tableData };
