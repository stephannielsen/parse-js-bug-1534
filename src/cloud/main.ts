Parse.Cloud.define("setupTestData", async () => {
  const existingUser = await (new Parse.Query(Parse.User).equalTo('username', 'testUser')).first({ useMasterKey: true});
  if (existingUser) {
    return existingUser;
  }
  const user = new Parse.User();
  user.setUsername("testUser");
  user.setPassword("testPassword");
  user.set('emailVerified', true);
  const savedUser = await user.save(null, { useMasterKey: true });
  const related = new Parse.Object("Related");
  const relation = related.relation("users");
  relation.add(savedUser);
  await related.save(null, { useMasterKey: true });
  return savedUser;
});

Parse.Cloud.define(
  "testRelation",
  async (request) => {
    const query = new Parse.Query<Parse.Object<{ user?: Parse.User }>>(
      "Related"
    );
    // @ts-ignore
    query.equalTo("users", request.user);
    const results = await query.find({ useMasterKey: true });
    return results;
  },
  { requireUser: true }
);
