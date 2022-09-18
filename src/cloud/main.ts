Parse.Cloud.define(
  "testRelation",
  async (request) => {
    const query = new Parse.Query<Parse.Object<{user?: Parse.User}>>("Related");
    // @ts-ignore
    query.equalTo("users", request.user);
    const results = await query.find({ useMasterKey: true });
    console.log({results});
    return results;
  },
  { requireUser: true }
);
