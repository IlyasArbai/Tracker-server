export class BaseRepo {
  static get model() {
    throw new Error("You must define a Prisma model in your repository");
  }

  static all(where) {
    return this.model.findMany({ where });
  }

  static find(where, select) {
    return this.model.findUnique({
      where,
      select,
    });
  }

  static create(data) {
    return this.model.create({
      data,
    });
  }

  static update(where, data) {
    return this.model.update({
      where,
      data,
    });
  }

  static delete(id) {
    return this.model.delete({
      where: { id },
    });
  }
}
