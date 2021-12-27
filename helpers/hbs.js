const moment = require("moment");

module.exports = {
  formatDate: function (date) {
    return moment(date).format("MMMM Do YYYY");
  },
  truncateStr: function (str, len) {
    let new_str = "";
    str.replace("&nbsp;", "");
    new_str = str.substr(0, len);
    new_str = new_str + "...";

    return new_str;
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },
  editIcon: function (storyUser, loggedUser, storyId) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
      return `<a href="/stories/edit/${storyId}" style="background:grey; margin-left: 2rem" class="p-3 rounded"><i class="fas fa-edit fa-small"></i></a>
      `;
    } else {
      return "";
    }
  },
};

/*

1. () -> for a group/range
2. (?:) ->used instead of ()
It indicates that the subpattern is a non-capture subpattern. That means whatever is matched in (?:\w+\s), even though it's enclosed by () it won't appear in the list of matches, only (\w+) will.

You're still looking for a specific pattern (in this case, a single whitespace character following at least one word), but you don't care what's actually matched.

3. .|\n either match i.e either dot or newline
4. * vs *? -> It is the difference between greedy and non-greedy quantifiers.

gredy finds all matches

5. gm ->global ie find all matches not just first one
6. / -<indicate start and end of expression

*/
