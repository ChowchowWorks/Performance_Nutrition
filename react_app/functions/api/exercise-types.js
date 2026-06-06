export async function onRequest(context) {
  try {
    const { DB } = context.env;

    if (!DB) {
      return Response.json(
        { error: "D1 binding DB is missing" },
        { status: 500 }
      );
    }

    const { results } = await DB
      .prepare("SELECT id, name FROM exercise_types")
      .all();

    return Response.json(results);
  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}