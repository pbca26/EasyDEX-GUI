//ref: https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
/**
 * Function to reorder an item in an array to another location
 * @param {Array} arr Array to modify
 * @param {Integer} old_index Index you would like to move
 * @param {Integer} new_index Index you would like to move old_index to
 */
export const arrayMove = (arr, old_index, new_index) => {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
};