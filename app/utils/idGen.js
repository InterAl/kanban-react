import _ from 'lodash';

export default {
  getNextId(collection) {
    return _(collection).map(element => element.id)
                        .max() + 1
  }
}
