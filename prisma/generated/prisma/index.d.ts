
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model course_completions
 * 
 */
export type course_completions = $Result.DefaultSelection<Prisma.$course_completionsPayload>
/**
 * Model courses
 * 
 */
export type courses = $Result.DefaultSelection<Prisma.$coursesPayload>
/**
 * Model enrollments
 * 
 */
export type enrollments = $Result.DefaultSelection<Prisma.$enrollmentsPayload>
/**
 * Model lesson_progress
 * 
 */
export type lesson_progress = $Result.DefaultSelection<Prisma.$lesson_progressPayload>
/**
 * Model lessons
 * 
 */
export type lessons = $Result.DefaultSelection<Prisma.$lessonsPayload>
/**
 * Model sections
 * 
 */
export type sections = $Result.DefaultSelection<Prisma.$sectionsPayload>
/**
 * Model creator_profiles
 * 
 */
export type creator_profiles = $Result.DefaultSelection<Prisma.$creator_profilesPayload>
/**
 * Model assessment_questions
 * 
 */
export type assessment_questions = $Result.DefaultSelection<Prisma.$assessment_questionsPayload>
/**
 * Model user_assessments
 * 
 */
export type user_assessments = $Result.DefaultSelection<Prisma.$user_assessmentsPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const CourseStatus: {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED'
};

export type CourseStatus = (typeof CourseStatus)[keyof typeof CourseStatus]

}

export type CourseStatus = $Enums.CourseStatus

export const CourseStatus: typeof $Enums.CourseStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Course_completions
 * const course_completions = await prisma.course_completions.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Course_completions
   * const course_completions = await prisma.course_completions.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.course_completions`: Exposes CRUD operations for the **course_completions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Course_completions
    * const course_completions = await prisma.course_completions.findMany()
    * ```
    */
  get course_completions(): Prisma.course_completionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.courses`: Exposes CRUD operations for the **courses** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Courses
    * const courses = await prisma.courses.findMany()
    * ```
    */
  get courses(): Prisma.coursesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.enrollments`: Exposes CRUD operations for the **enrollments** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Enrollments
    * const enrollments = await prisma.enrollments.findMany()
    * ```
    */
  get enrollments(): Prisma.enrollmentsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lesson_progress`: Exposes CRUD operations for the **lesson_progress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lesson_progresses
    * const lesson_progresses = await prisma.lesson_progress.findMany()
    * ```
    */
  get lesson_progress(): Prisma.lesson_progressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lessons`: Exposes CRUD operations for the **lessons** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lessons
    * const lessons = await prisma.lessons.findMany()
    * ```
    */
  get lessons(): Prisma.lessonsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sections`: Exposes CRUD operations for the **sections** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sections
    * const sections = await prisma.sections.findMany()
    * ```
    */
  get sections(): Prisma.sectionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.creator_profiles`: Exposes CRUD operations for the **creator_profiles** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Creator_profiles
    * const creator_profiles = await prisma.creator_profiles.findMany()
    * ```
    */
  get creator_profiles(): Prisma.creator_profilesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.assessment_questions`: Exposes CRUD operations for the **assessment_questions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Assessment_questions
    * const assessment_questions = await prisma.assessment_questions.findMany()
    * ```
    */
  get assessment_questions(): Prisma.assessment_questionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user_assessments`: Exposes CRUD operations for the **user_assessments** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_assessments
    * const user_assessments = await prisma.user_assessments.findMany()
    * ```
    */
  get user_assessments(): Prisma.user_assessmentsDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.2
   * Query Engine version: 94a226be1cf2967af2541cca5529f0f7ba866919
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    course_completions: 'course_completions',
    courses: 'courses',
    enrollments: 'enrollments',
    lesson_progress: 'lesson_progress',
    lessons: 'lessons',
    sections: 'sections',
    creator_profiles: 'creator_profiles',
    assessment_questions: 'assessment_questions',
    user_assessments: 'user_assessments'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "course_completions" | "courses" | "enrollments" | "lesson_progress" | "lessons" | "sections" | "creator_profiles" | "assessment_questions" | "user_assessments"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      course_completions: {
        payload: Prisma.$course_completionsPayload<ExtArgs>
        fields: Prisma.course_completionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.course_completionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$course_completionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.course_completionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$course_completionsPayload>
          }
          findFirst: {
            args: Prisma.course_completionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$course_completionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.course_completionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$course_completionsPayload>
          }
          findMany: {
            args: Prisma.course_completionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$course_completionsPayload>[]
          }
          create: {
            args: Prisma.course_completionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$course_completionsPayload>
          }
          createMany: {
            args: Prisma.course_completionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.course_completionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$course_completionsPayload>[]
          }
          delete: {
            args: Prisma.course_completionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$course_completionsPayload>
          }
          update: {
            args: Prisma.course_completionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$course_completionsPayload>
          }
          deleteMany: {
            args: Prisma.course_completionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.course_completionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.course_completionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$course_completionsPayload>[]
          }
          upsert: {
            args: Prisma.course_completionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$course_completionsPayload>
          }
          aggregate: {
            args: Prisma.Course_completionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCourse_completions>
          }
          groupBy: {
            args: Prisma.course_completionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Course_completionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.course_completionsCountArgs<ExtArgs>
            result: $Utils.Optional<Course_completionsCountAggregateOutputType> | number
          }
        }
      }
      courses: {
        payload: Prisma.$coursesPayload<ExtArgs>
        fields: Prisma.coursesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.coursesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$coursesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.coursesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$coursesPayload>
          }
          findFirst: {
            args: Prisma.coursesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$coursesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.coursesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$coursesPayload>
          }
          findMany: {
            args: Prisma.coursesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$coursesPayload>[]
          }
          create: {
            args: Prisma.coursesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$coursesPayload>
          }
          createMany: {
            args: Prisma.coursesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.coursesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$coursesPayload>[]
          }
          delete: {
            args: Prisma.coursesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$coursesPayload>
          }
          update: {
            args: Prisma.coursesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$coursesPayload>
          }
          deleteMany: {
            args: Prisma.coursesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.coursesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.coursesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$coursesPayload>[]
          }
          upsert: {
            args: Prisma.coursesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$coursesPayload>
          }
          aggregate: {
            args: Prisma.CoursesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCourses>
          }
          groupBy: {
            args: Prisma.coursesGroupByArgs<ExtArgs>
            result: $Utils.Optional<CoursesGroupByOutputType>[]
          }
          count: {
            args: Prisma.coursesCountArgs<ExtArgs>
            result: $Utils.Optional<CoursesCountAggregateOutputType> | number
          }
        }
      }
      enrollments: {
        payload: Prisma.$enrollmentsPayload<ExtArgs>
        fields: Prisma.enrollmentsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.enrollmentsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$enrollmentsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.enrollmentsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$enrollmentsPayload>
          }
          findFirst: {
            args: Prisma.enrollmentsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$enrollmentsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.enrollmentsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$enrollmentsPayload>
          }
          findMany: {
            args: Prisma.enrollmentsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$enrollmentsPayload>[]
          }
          create: {
            args: Prisma.enrollmentsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$enrollmentsPayload>
          }
          createMany: {
            args: Prisma.enrollmentsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.enrollmentsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$enrollmentsPayload>[]
          }
          delete: {
            args: Prisma.enrollmentsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$enrollmentsPayload>
          }
          update: {
            args: Prisma.enrollmentsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$enrollmentsPayload>
          }
          deleteMany: {
            args: Prisma.enrollmentsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.enrollmentsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.enrollmentsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$enrollmentsPayload>[]
          }
          upsert: {
            args: Prisma.enrollmentsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$enrollmentsPayload>
          }
          aggregate: {
            args: Prisma.EnrollmentsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEnrollments>
          }
          groupBy: {
            args: Prisma.enrollmentsGroupByArgs<ExtArgs>
            result: $Utils.Optional<EnrollmentsGroupByOutputType>[]
          }
          count: {
            args: Prisma.enrollmentsCountArgs<ExtArgs>
            result: $Utils.Optional<EnrollmentsCountAggregateOutputType> | number
          }
        }
      }
      lesson_progress: {
        payload: Prisma.$lesson_progressPayload<ExtArgs>
        fields: Prisma.lesson_progressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.lesson_progressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lesson_progressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.lesson_progressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lesson_progressPayload>
          }
          findFirst: {
            args: Prisma.lesson_progressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lesson_progressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.lesson_progressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lesson_progressPayload>
          }
          findMany: {
            args: Prisma.lesson_progressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lesson_progressPayload>[]
          }
          create: {
            args: Prisma.lesson_progressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lesson_progressPayload>
          }
          createMany: {
            args: Prisma.lesson_progressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.lesson_progressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lesson_progressPayload>[]
          }
          delete: {
            args: Prisma.lesson_progressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lesson_progressPayload>
          }
          update: {
            args: Prisma.lesson_progressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lesson_progressPayload>
          }
          deleteMany: {
            args: Prisma.lesson_progressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.lesson_progressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.lesson_progressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lesson_progressPayload>[]
          }
          upsert: {
            args: Prisma.lesson_progressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lesson_progressPayload>
          }
          aggregate: {
            args: Prisma.Lesson_progressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLesson_progress>
          }
          groupBy: {
            args: Prisma.lesson_progressGroupByArgs<ExtArgs>
            result: $Utils.Optional<Lesson_progressGroupByOutputType>[]
          }
          count: {
            args: Prisma.lesson_progressCountArgs<ExtArgs>
            result: $Utils.Optional<Lesson_progressCountAggregateOutputType> | number
          }
        }
      }
      lessons: {
        payload: Prisma.$lessonsPayload<ExtArgs>
        fields: Prisma.lessonsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.lessonsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.lessonsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonsPayload>
          }
          findFirst: {
            args: Prisma.lessonsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.lessonsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonsPayload>
          }
          findMany: {
            args: Prisma.lessonsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonsPayload>[]
          }
          create: {
            args: Prisma.lessonsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonsPayload>
          }
          createMany: {
            args: Prisma.lessonsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.lessonsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonsPayload>[]
          }
          delete: {
            args: Prisma.lessonsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonsPayload>
          }
          update: {
            args: Prisma.lessonsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonsPayload>
          }
          deleteMany: {
            args: Prisma.lessonsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.lessonsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.lessonsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonsPayload>[]
          }
          upsert: {
            args: Prisma.lessonsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$lessonsPayload>
          }
          aggregate: {
            args: Prisma.LessonsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLessons>
          }
          groupBy: {
            args: Prisma.lessonsGroupByArgs<ExtArgs>
            result: $Utils.Optional<LessonsGroupByOutputType>[]
          }
          count: {
            args: Prisma.lessonsCountArgs<ExtArgs>
            result: $Utils.Optional<LessonsCountAggregateOutputType> | number
          }
        }
      }
      sections: {
        payload: Prisma.$sectionsPayload<ExtArgs>
        fields: Prisma.sectionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.sectionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sectionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.sectionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sectionsPayload>
          }
          findFirst: {
            args: Prisma.sectionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sectionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.sectionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sectionsPayload>
          }
          findMany: {
            args: Prisma.sectionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sectionsPayload>[]
          }
          create: {
            args: Prisma.sectionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sectionsPayload>
          }
          createMany: {
            args: Prisma.sectionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.sectionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sectionsPayload>[]
          }
          delete: {
            args: Prisma.sectionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sectionsPayload>
          }
          update: {
            args: Prisma.sectionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sectionsPayload>
          }
          deleteMany: {
            args: Prisma.sectionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.sectionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.sectionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sectionsPayload>[]
          }
          upsert: {
            args: Prisma.sectionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sectionsPayload>
          }
          aggregate: {
            args: Prisma.SectionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSections>
          }
          groupBy: {
            args: Prisma.sectionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<SectionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.sectionsCountArgs<ExtArgs>
            result: $Utils.Optional<SectionsCountAggregateOutputType> | number
          }
        }
      }
      creator_profiles: {
        payload: Prisma.$creator_profilesPayload<ExtArgs>
        fields: Prisma.creator_profilesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.creator_profilesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$creator_profilesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.creator_profilesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$creator_profilesPayload>
          }
          findFirst: {
            args: Prisma.creator_profilesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$creator_profilesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.creator_profilesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$creator_profilesPayload>
          }
          findMany: {
            args: Prisma.creator_profilesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$creator_profilesPayload>[]
          }
          create: {
            args: Prisma.creator_profilesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$creator_profilesPayload>
          }
          createMany: {
            args: Prisma.creator_profilesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.creator_profilesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$creator_profilesPayload>[]
          }
          delete: {
            args: Prisma.creator_profilesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$creator_profilesPayload>
          }
          update: {
            args: Prisma.creator_profilesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$creator_profilesPayload>
          }
          deleteMany: {
            args: Prisma.creator_profilesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.creator_profilesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.creator_profilesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$creator_profilesPayload>[]
          }
          upsert: {
            args: Prisma.creator_profilesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$creator_profilesPayload>
          }
          aggregate: {
            args: Prisma.Creator_profilesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCreator_profiles>
          }
          groupBy: {
            args: Prisma.creator_profilesGroupByArgs<ExtArgs>
            result: $Utils.Optional<Creator_profilesGroupByOutputType>[]
          }
          count: {
            args: Prisma.creator_profilesCountArgs<ExtArgs>
            result: $Utils.Optional<Creator_profilesCountAggregateOutputType> | number
          }
        }
      }
      assessment_questions: {
        payload: Prisma.$assessment_questionsPayload<ExtArgs>
        fields: Prisma.assessment_questionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.assessment_questionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$assessment_questionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.assessment_questionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$assessment_questionsPayload>
          }
          findFirst: {
            args: Prisma.assessment_questionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$assessment_questionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.assessment_questionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$assessment_questionsPayload>
          }
          findMany: {
            args: Prisma.assessment_questionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$assessment_questionsPayload>[]
          }
          create: {
            args: Prisma.assessment_questionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$assessment_questionsPayload>
          }
          createMany: {
            args: Prisma.assessment_questionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.assessment_questionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$assessment_questionsPayload>[]
          }
          delete: {
            args: Prisma.assessment_questionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$assessment_questionsPayload>
          }
          update: {
            args: Prisma.assessment_questionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$assessment_questionsPayload>
          }
          deleteMany: {
            args: Prisma.assessment_questionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.assessment_questionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.assessment_questionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$assessment_questionsPayload>[]
          }
          upsert: {
            args: Prisma.assessment_questionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$assessment_questionsPayload>
          }
          aggregate: {
            args: Prisma.Assessment_questionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAssessment_questions>
          }
          groupBy: {
            args: Prisma.assessment_questionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Assessment_questionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.assessment_questionsCountArgs<ExtArgs>
            result: $Utils.Optional<Assessment_questionsCountAggregateOutputType> | number
          }
        }
      }
      user_assessments: {
        payload: Prisma.$user_assessmentsPayload<ExtArgs>
        fields: Prisma.user_assessmentsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.user_assessmentsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_assessmentsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_assessmentsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_assessmentsPayload>
          }
          findFirst: {
            args: Prisma.user_assessmentsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_assessmentsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_assessmentsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_assessmentsPayload>
          }
          findMany: {
            args: Prisma.user_assessmentsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_assessmentsPayload>[]
          }
          create: {
            args: Prisma.user_assessmentsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_assessmentsPayload>
          }
          createMany: {
            args: Prisma.user_assessmentsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.user_assessmentsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_assessmentsPayload>[]
          }
          delete: {
            args: Prisma.user_assessmentsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_assessmentsPayload>
          }
          update: {
            args: Prisma.user_assessmentsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_assessmentsPayload>
          }
          deleteMany: {
            args: Prisma.user_assessmentsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.user_assessmentsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.user_assessmentsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_assessmentsPayload>[]
          }
          upsert: {
            args: Prisma.user_assessmentsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_assessmentsPayload>
          }
          aggregate: {
            args: Prisma.User_assessmentsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser_assessments>
          }
          groupBy: {
            args: Prisma.user_assessmentsGroupByArgs<ExtArgs>
            result: $Utils.Optional<User_assessmentsGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_assessmentsCountArgs<ExtArgs>
            result: $Utils.Optional<User_assessmentsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    course_completions?: course_completionsOmit
    courses?: coursesOmit
    enrollments?: enrollmentsOmit
    lesson_progress?: lesson_progressOmit
    lessons?: lessonsOmit
    sections?: sectionsOmit
    creator_profiles?: creator_profilesOmit
    assessment_questions?: assessment_questionsOmit
    user_assessments?: user_assessmentsOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CoursesCountOutputType
   */

  export type CoursesCountOutputType = {
    enrollments: number
    sections: number
    assessment_questions: number
    user_assessments: number
  }

  export type CoursesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enrollments?: boolean | CoursesCountOutputTypeCountEnrollmentsArgs
    sections?: boolean | CoursesCountOutputTypeCountSectionsArgs
    assessment_questions?: boolean | CoursesCountOutputTypeCountAssessment_questionsArgs
    user_assessments?: boolean | CoursesCountOutputTypeCountUser_assessmentsArgs
  }

  // Custom InputTypes
  /**
   * CoursesCountOutputType without action
   */
  export type CoursesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CoursesCountOutputType
     */
    select?: CoursesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CoursesCountOutputType without action
   */
  export type CoursesCountOutputTypeCountEnrollmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: enrollmentsWhereInput
  }

  /**
   * CoursesCountOutputType without action
   */
  export type CoursesCountOutputTypeCountSectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: sectionsWhereInput
  }

  /**
   * CoursesCountOutputType without action
   */
  export type CoursesCountOutputTypeCountAssessment_questionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: assessment_questionsWhereInput
  }

  /**
   * CoursesCountOutputType without action
   */
  export type CoursesCountOutputTypeCountUser_assessmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_assessmentsWhereInput
  }


  /**
   * Count Type LessonsCountOutputType
   */

  export type LessonsCountOutputType = {
    lesson_progress: number
  }

  export type LessonsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lesson_progress?: boolean | LessonsCountOutputTypeCountLesson_progressArgs
  }

  // Custom InputTypes
  /**
   * LessonsCountOutputType without action
   */
  export type LessonsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonsCountOutputType
     */
    select?: LessonsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LessonsCountOutputType without action
   */
  export type LessonsCountOutputTypeCountLesson_progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: lesson_progressWhereInput
  }


  /**
   * Count Type SectionsCountOutputType
   */

  export type SectionsCountOutputType = {
    lessons: number
    assessment_questions: number
    user_assessments: number
  }

  export type SectionsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lessons?: boolean | SectionsCountOutputTypeCountLessonsArgs
    assessment_questions?: boolean | SectionsCountOutputTypeCountAssessment_questionsArgs
    user_assessments?: boolean | SectionsCountOutputTypeCountUser_assessmentsArgs
  }

  // Custom InputTypes
  /**
   * SectionsCountOutputType without action
   */
  export type SectionsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SectionsCountOutputType
     */
    select?: SectionsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SectionsCountOutputType without action
   */
  export type SectionsCountOutputTypeCountLessonsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: lessonsWhereInput
  }

  /**
   * SectionsCountOutputType without action
   */
  export type SectionsCountOutputTypeCountAssessment_questionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: assessment_questionsWhereInput
  }

  /**
   * SectionsCountOutputType without action
   */
  export type SectionsCountOutputTypeCountUser_assessmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_assessmentsWhereInput
  }


  /**
   * Models
   */

  /**
   * Model course_completions
   */

  export type AggregateCourse_completions = {
    _count: Course_completionsCountAggregateOutputType | null
    _avg: Course_completionsAvgAggregateOutputType | null
    _sum: Course_completionsSumAggregateOutputType | null
    _min: Course_completionsMinAggregateOutputType | null
    _max: Course_completionsMaxAggregateOutputType | null
  }

  export type Course_completionsAvgAggregateOutputType = {
    percentage: number | null
  }

  export type Course_completionsSumAggregateOutputType = {
    percentage: number | null
  }

  export type Course_completionsMinAggregateOutputType = {
    id: string | null
    courseId: string | null
    userId: string | null
    percentage: number | null
    completed: boolean | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Course_completionsMaxAggregateOutputType = {
    id: string | null
    courseId: string | null
    userId: string | null
    percentage: number | null
    completed: boolean | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Course_completionsCountAggregateOutputType = {
    id: number
    courseId: number
    userId: number
    percentage: number
    completed: number
    completedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type Course_completionsAvgAggregateInputType = {
    percentage?: true
  }

  export type Course_completionsSumAggregateInputType = {
    percentage?: true
  }

  export type Course_completionsMinAggregateInputType = {
    id?: true
    courseId?: true
    userId?: true
    percentage?: true
    completed?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Course_completionsMaxAggregateInputType = {
    id?: true
    courseId?: true
    userId?: true
    percentage?: true
    completed?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Course_completionsCountAggregateInputType = {
    id?: true
    courseId?: true
    userId?: true
    percentage?: true
    completed?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type Course_completionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which course_completions to aggregate.
     */
    where?: course_completionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of course_completions to fetch.
     */
    orderBy?: course_completionsOrderByWithRelationInput | course_completionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: course_completionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` course_completions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` course_completions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned course_completions
    **/
    _count?: true | Course_completionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Course_completionsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Course_completionsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Course_completionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Course_completionsMaxAggregateInputType
  }

  export type GetCourse_completionsAggregateType<T extends Course_completionsAggregateArgs> = {
        [P in keyof T & keyof AggregateCourse_completions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCourse_completions[P]>
      : GetScalarType<T[P], AggregateCourse_completions[P]>
  }




  export type course_completionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: course_completionsWhereInput
    orderBy?: course_completionsOrderByWithAggregationInput | course_completionsOrderByWithAggregationInput[]
    by: Course_completionsScalarFieldEnum[] | Course_completionsScalarFieldEnum
    having?: course_completionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Course_completionsCountAggregateInputType | true
    _avg?: Course_completionsAvgAggregateInputType
    _sum?: Course_completionsSumAggregateInputType
    _min?: Course_completionsMinAggregateInputType
    _max?: Course_completionsMaxAggregateInputType
  }

  export type Course_completionsGroupByOutputType = {
    id: string
    courseId: string
    userId: string
    percentage: number
    completed: boolean
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: Course_completionsCountAggregateOutputType | null
    _avg: Course_completionsAvgAggregateOutputType | null
    _sum: Course_completionsSumAggregateOutputType | null
    _min: Course_completionsMinAggregateOutputType | null
    _max: Course_completionsMaxAggregateOutputType | null
  }

  type GetCourse_completionsGroupByPayload<T extends course_completionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Course_completionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Course_completionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Course_completionsGroupByOutputType[P]>
            : GetScalarType<T[P], Course_completionsGroupByOutputType[P]>
        }
      >
    >


  export type course_completionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    courseId?: boolean
    userId?: boolean
    percentage?: boolean
    completed?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["course_completions"]>

  export type course_completionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    courseId?: boolean
    userId?: boolean
    percentage?: boolean
    completed?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["course_completions"]>

  export type course_completionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    courseId?: boolean
    userId?: boolean
    percentage?: boolean
    completed?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["course_completions"]>

  export type course_completionsSelectScalar = {
    id?: boolean
    courseId?: boolean
    userId?: boolean
    percentage?: boolean
    completed?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type course_completionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "courseId" | "userId" | "percentage" | "completed" | "completedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["course_completions"]>

  export type $course_completionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "course_completions"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      courseId: string
      userId: string
      percentage: number
      completed: boolean
      completedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["course_completions"]>
    composites: {}
  }

  type course_completionsGetPayload<S extends boolean | null | undefined | course_completionsDefaultArgs> = $Result.GetResult<Prisma.$course_completionsPayload, S>

  type course_completionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<course_completionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: Course_completionsCountAggregateInputType | true
    }

  export interface course_completionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['course_completions'], meta: { name: 'course_completions' } }
    /**
     * Find zero or one Course_completions that matches the filter.
     * @param {course_completionsFindUniqueArgs} args - Arguments to find a Course_completions
     * @example
     * // Get one Course_completions
     * const course_completions = await prisma.course_completions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends course_completionsFindUniqueArgs>(args: SelectSubset<T, course_completionsFindUniqueArgs<ExtArgs>>): Prisma__course_completionsClient<$Result.GetResult<Prisma.$course_completionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Course_completions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {course_completionsFindUniqueOrThrowArgs} args - Arguments to find a Course_completions
     * @example
     * // Get one Course_completions
     * const course_completions = await prisma.course_completions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends course_completionsFindUniqueOrThrowArgs>(args: SelectSubset<T, course_completionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__course_completionsClient<$Result.GetResult<Prisma.$course_completionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Course_completions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {course_completionsFindFirstArgs} args - Arguments to find a Course_completions
     * @example
     * // Get one Course_completions
     * const course_completions = await prisma.course_completions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends course_completionsFindFirstArgs>(args?: SelectSubset<T, course_completionsFindFirstArgs<ExtArgs>>): Prisma__course_completionsClient<$Result.GetResult<Prisma.$course_completionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Course_completions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {course_completionsFindFirstOrThrowArgs} args - Arguments to find a Course_completions
     * @example
     * // Get one Course_completions
     * const course_completions = await prisma.course_completions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends course_completionsFindFirstOrThrowArgs>(args?: SelectSubset<T, course_completionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__course_completionsClient<$Result.GetResult<Prisma.$course_completionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Course_completions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {course_completionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Course_completions
     * const course_completions = await prisma.course_completions.findMany()
     * 
     * // Get first 10 Course_completions
     * const course_completions = await prisma.course_completions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const course_completionsWithIdOnly = await prisma.course_completions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends course_completionsFindManyArgs>(args?: SelectSubset<T, course_completionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$course_completionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Course_completions.
     * @param {course_completionsCreateArgs} args - Arguments to create a Course_completions.
     * @example
     * // Create one Course_completions
     * const Course_completions = await prisma.course_completions.create({
     *   data: {
     *     // ... data to create a Course_completions
     *   }
     * })
     * 
     */
    create<T extends course_completionsCreateArgs>(args: SelectSubset<T, course_completionsCreateArgs<ExtArgs>>): Prisma__course_completionsClient<$Result.GetResult<Prisma.$course_completionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Course_completions.
     * @param {course_completionsCreateManyArgs} args - Arguments to create many Course_completions.
     * @example
     * // Create many Course_completions
     * const course_completions = await prisma.course_completions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends course_completionsCreateManyArgs>(args?: SelectSubset<T, course_completionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Course_completions and returns the data saved in the database.
     * @param {course_completionsCreateManyAndReturnArgs} args - Arguments to create many Course_completions.
     * @example
     * // Create many Course_completions
     * const course_completions = await prisma.course_completions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Course_completions and only return the `id`
     * const course_completionsWithIdOnly = await prisma.course_completions.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends course_completionsCreateManyAndReturnArgs>(args?: SelectSubset<T, course_completionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$course_completionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Course_completions.
     * @param {course_completionsDeleteArgs} args - Arguments to delete one Course_completions.
     * @example
     * // Delete one Course_completions
     * const Course_completions = await prisma.course_completions.delete({
     *   where: {
     *     // ... filter to delete one Course_completions
     *   }
     * })
     * 
     */
    delete<T extends course_completionsDeleteArgs>(args: SelectSubset<T, course_completionsDeleteArgs<ExtArgs>>): Prisma__course_completionsClient<$Result.GetResult<Prisma.$course_completionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Course_completions.
     * @param {course_completionsUpdateArgs} args - Arguments to update one Course_completions.
     * @example
     * // Update one Course_completions
     * const course_completions = await prisma.course_completions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends course_completionsUpdateArgs>(args: SelectSubset<T, course_completionsUpdateArgs<ExtArgs>>): Prisma__course_completionsClient<$Result.GetResult<Prisma.$course_completionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Course_completions.
     * @param {course_completionsDeleteManyArgs} args - Arguments to filter Course_completions to delete.
     * @example
     * // Delete a few Course_completions
     * const { count } = await prisma.course_completions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends course_completionsDeleteManyArgs>(args?: SelectSubset<T, course_completionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Course_completions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {course_completionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Course_completions
     * const course_completions = await prisma.course_completions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends course_completionsUpdateManyArgs>(args: SelectSubset<T, course_completionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Course_completions and returns the data updated in the database.
     * @param {course_completionsUpdateManyAndReturnArgs} args - Arguments to update many Course_completions.
     * @example
     * // Update many Course_completions
     * const course_completions = await prisma.course_completions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Course_completions and only return the `id`
     * const course_completionsWithIdOnly = await prisma.course_completions.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends course_completionsUpdateManyAndReturnArgs>(args: SelectSubset<T, course_completionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$course_completionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Course_completions.
     * @param {course_completionsUpsertArgs} args - Arguments to update or create a Course_completions.
     * @example
     * // Update or create a Course_completions
     * const course_completions = await prisma.course_completions.upsert({
     *   create: {
     *     // ... data to create a Course_completions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Course_completions we want to update
     *   }
     * })
     */
    upsert<T extends course_completionsUpsertArgs>(args: SelectSubset<T, course_completionsUpsertArgs<ExtArgs>>): Prisma__course_completionsClient<$Result.GetResult<Prisma.$course_completionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Course_completions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {course_completionsCountArgs} args - Arguments to filter Course_completions to count.
     * @example
     * // Count the number of Course_completions
     * const count = await prisma.course_completions.count({
     *   where: {
     *     // ... the filter for the Course_completions we want to count
     *   }
     * })
    **/
    count<T extends course_completionsCountArgs>(
      args?: Subset<T, course_completionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Course_completionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Course_completions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Course_completionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Course_completionsAggregateArgs>(args: Subset<T, Course_completionsAggregateArgs>): Prisma.PrismaPromise<GetCourse_completionsAggregateType<T>>

    /**
     * Group by Course_completions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {course_completionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends course_completionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: course_completionsGroupByArgs['orderBy'] }
        : { orderBy?: course_completionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, course_completionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourse_completionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the course_completions model
   */
  readonly fields: course_completionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for course_completions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__course_completionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the course_completions model
   */
  interface course_completionsFieldRefs {
    readonly id: FieldRef<"course_completions", 'String'>
    readonly courseId: FieldRef<"course_completions", 'String'>
    readonly userId: FieldRef<"course_completions", 'String'>
    readonly percentage: FieldRef<"course_completions", 'Float'>
    readonly completed: FieldRef<"course_completions", 'Boolean'>
    readonly completedAt: FieldRef<"course_completions", 'DateTime'>
    readonly createdAt: FieldRef<"course_completions", 'DateTime'>
    readonly updatedAt: FieldRef<"course_completions", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * course_completions findUnique
   */
  export type course_completionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the course_completions
     */
    select?: course_completionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the course_completions
     */
    omit?: course_completionsOmit<ExtArgs> | null
    /**
     * Filter, which course_completions to fetch.
     */
    where: course_completionsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * course_completions findUniqueOrThrow
   */
  export type course_completionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the course_completions
     */
    select?: course_completionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the course_completions
     */
    omit?: course_completionsOmit<ExtArgs> | null
    /**
     * Filter, which course_completions to fetch.
     */
    where: course_completionsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * course_completions findFirst
   */
  export type course_completionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the course_completions
     */
    select?: course_completionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the course_completions
     */
    omit?: course_completionsOmit<ExtArgs> | null
    /**
     * Filter, which course_completions to fetch.
     */
    where?: course_completionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of course_completions to fetch.
     */
    orderBy?: course_completionsOrderByWithRelationInput | course_completionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for course_completions.
     */
    cursor?: course_completionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` course_completions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` course_completions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of course_completions.
     */
    distinct?: Course_completionsScalarFieldEnum | Course_completionsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * course_completions findFirstOrThrow
   */
  export type course_completionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the course_completions
     */
    select?: course_completionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the course_completions
     */
    omit?: course_completionsOmit<ExtArgs> | null
    /**
     * Filter, which course_completions to fetch.
     */
    where?: course_completionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of course_completions to fetch.
     */
    orderBy?: course_completionsOrderByWithRelationInput | course_completionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for course_completions.
     */
    cursor?: course_completionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` course_completions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` course_completions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of course_completions.
     */
    distinct?: Course_completionsScalarFieldEnum | Course_completionsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * course_completions findMany
   */
  export type course_completionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the course_completions
     */
    select?: course_completionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the course_completions
     */
    omit?: course_completionsOmit<ExtArgs> | null
    /**
     * Filter, which course_completions to fetch.
     */
    where?: course_completionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of course_completions to fetch.
     */
    orderBy?: course_completionsOrderByWithRelationInput | course_completionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing course_completions.
     */
    cursor?: course_completionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` course_completions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` course_completions.
     */
    skip?: number
    distinct?: Course_completionsScalarFieldEnum | Course_completionsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * course_completions create
   */
  export type course_completionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the course_completions
     */
    select?: course_completionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the course_completions
     */
    omit?: course_completionsOmit<ExtArgs> | null
    /**
     * The data needed to create a course_completions.
     */
    data: XOR<course_completionsCreateInput, course_completionsUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * course_completions createMany
   */
  export type course_completionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many course_completions.
     */
    data: course_completionsCreateManyInput | course_completionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * course_completions createManyAndReturn
   */
  export type course_completionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the course_completions
     */
    select?: course_completionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the course_completions
     */
    omit?: course_completionsOmit<ExtArgs> | null
    /**
     * The data used to create many course_completions.
     */
    data: course_completionsCreateManyInput | course_completionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * course_completions update
   */
  export type course_completionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the course_completions
     */
    select?: course_completionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the course_completions
     */
    omit?: course_completionsOmit<ExtArgs> | null
    /**
     * The data needed to update a course_completions.
     */
    data: XOR<course_completionsUpdateInput, course_completionsUncheckedUpdateInput>
    /**
     * Choose, which course_completions to update.
     */
    where: course_completionsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * course_completions updateMany
   */
  export type course_completionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update course_completions.
     */
    data: XOR<course_completionsUpdateManyMutationInput, course_completionsUncheckedUpdateManyInput>
    /**
     * Filter which course_completions to update
     */
    where?: course_completionsWhereInput
    /**
     * Limit how many course_completions to update.
     */
    limit?: number
  }

  /**
   * course_completions updateManyAndReturn
   */
  export type course_completionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the course_completions
     */
    select?: course_completionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the course_completions
     */
    omit?: course_completionsOmit<ExtArgs> | null
    /**
     * The data used to update course_completions.
     */
    data: XOR<course_completionsUpdateManyMutationInput, course_completionsUncheckedUpdateManyInput>
    /**
     * Filter which course_completions to update
     */
    where?: course_completionsWhereInput
    /**
     * Limit how many course_completions to update.
     */
    limit?: number
  }

  /**
   * course_completions upsert
   */
  export type course_completionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the course_completions
     */
    select?: course_completionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the course_completions
     */
    omit?: course_completionsOmit<ExtArgs> | null
    /**
     * The filter to search for the course_completions to update in case it exists.
     */
    where: course_completionsWhereUniqueInput
    /**
     * In case the course_completions found by the `where` argument doesn't exist, create a new course_completions with this data.
     */
    create: XOR<course_completionsCreateInput, course_completionsUncheckedCreateInput>
    /**
     * In case the course_completions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<course_completionsUpdateInput, course_completionsUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * course_completions delete
   */
  export type course_completionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the course_completions
     */
    select?: course_completionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the course_completions
     */
    omit?: course_completionsOmit<ExtArgs> | null
    /**
     * Filter which course_completions to delete.
     */
    where: course_completionsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * course_completions deleteMany
   */
  export type course_completionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which course_completions to delete
     */
    where?: course_completionsWhereInput
    /**
     * Limit how many course_completions to delete.
     */
    limit?: number
  }

  /**
   * course_completions without action
   */
  export type course_completionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the course_completions
     */
    select?: course_completionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the course_completions
     */
    omit?: course_completionsOmit<ExtArgs> | null
  }


  /**
   * Model courses
   */

  export type AggregateCourses = {
    _count: CoursesCountAggregateOutputType | null
    _avg: CoursesAvgAggregateOutputType | null
    _sum: CoursesSumAggregateOutputType | null
    _min: CoursesMinAggregateOutputType | null
    _max: CoursesMaxAggregateOutputType | null
  }

  export type CoursesAvgAggregateOutputType = {
    students: number | null
    lessons: number | null
    rating: number | null
  }

  export type CoursesSumAggregateOutputType = {
    students: number | null
    lessons: number | null
    rating: number | null
  }

  export type CoursesMinAggregateOutputType = {
    id: string | null
    slug: string | null
    title: string | null
    description: string | null
    thumbnail: string | null
    status: $Enums.CourseStatus | null
    students: number | null
    lessons: number | null
    duration: string | null
    rating: number | null
    category: string | null
    difficulty: string | null
    creatorId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CoursesMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    title: string | null
    description: string | null
    thumbnail: string | null
    status: $Enums.CourseStatus | null
    students: number | null
    lessons: number | null
    duration: string | null
    rating: number | null
    category: string | null
    difficulty: string | null
    creatorId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CoursesCountAggregateOutputType = {
    id: number
    slug: number
    title: number
    description: number
    thumbnail: number
    status: number
    students: number
    lessons: number
    duration: number
    rating: number
    category: number
    difficulty: number
    creatorId: number
    outcomes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CoursesAvgAggregateInputType = {
    students?: true
    lessons?: true
    rating?: true
  }

  export type CoursesSumAggregateInputType = {
    students?: true
    lessons?: true
    rating?: true
  }

  export type CoursesMinAggregateInputType = {
    id?: true
    slug?: true
    title?: true
    description?: true
    thumbnail?: true
    status?: true
    students?: true
    lessons?: true
    duration?: true
    rating?: true
    category?: true
    difficulty?: true
    creatorId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CoursesMaxAggregateInputType = {
    id?: true
    slug?: true
    title?: true
    description?: true
    thumbnail?: true
    status?: true
    students?: true
    lessons?: true
    duration?: true
    rating?: true
    category?: true
    difficulty?: true
    creatorId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CoursesCountAggregateInputType = {
    id?: true
    slug?: true
    title?: true
    description?: true
    thumbnail?: true
    status?: true
    students?: true
    lessons?: true
    duration?: true
    rating?: true
    category?: true
    difficulty?: true
    creatorId?: true
    outcomes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CoursesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which courses to aggregate.
     */
    where?: coursesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of courses to fetch.
     */
    orderBy?: coursesOrderByWithRelationInput | coursesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: coursesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` courses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned courses
    **/
    _count?: true | CoursesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CoursesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CoursesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CoursesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CoursesMaxAggregateInputType
  }

  export type GetCoursesAggregateType<T extends CoursesAggregateArgs> = {
        [P in keyof T & keyof AggregateCourses]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCourses[P]>
      : GetScalarType<T[P], AggregateCourses[P]>
  }




  export type coursesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: coursesWhereInput
    orderBy?: coursesOrderByWithAggregationInput | coursesOrderByWithAggregationInput[]
    by: CoursesScalarFieldEnum[] | CoursesScalarFieldEnum
    having?: coursesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CoursesCountAggregateInputType | true
    _avg?: CoursesAvgAggregateInputType
    _sum?: CoursesSumAggregateInputType
    _min?: CoursesMinAggregateInputType
    _max?: CoursesMaxAggregateInputType
  }

  export type CoursesGroupByOutputType = {
    id: string
    slug: string
    title: string
    description: string
    thumbnail: string | null
    status: $Enums.CourseStatus
    students: number
    lessons: number
    duration: string
    rating: number
    category: string
    difficulty: string | null
    creatorId: string
    outcomes: string[]
    createdAt: Date
    updatedAt: Date
    _count: CoursesCountAggregateOutputType | null
    _avg: CoursesAvgAggregateOutputType | null
    _sum: CoursesSumAggregateOutputType | null
    _min: CoursesMinAggregateOutputType | null
    _max: CoursesMaxAggregateOutputType | null
  }

  type GetCoursesGroupByPayload<T extends coursesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CoursesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CoursesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CoursesGroupByOutputType[P]>
            : GetScalarType<T[P], CoursesGroupByOutputType[P]>
        }
      >
    >


  export type coursesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    title?: boolean
    description?: boolean
    thumbnail?: boolean
    status?: boolean
    students?: boolean
    lessons?: boolean
    duration?: boolean
    rating?: boolean
    category?: boolean
    difficulty?: boolean
    creatorId?: boolean
    outcomes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enrollments?: boolean | courses$enrollmentsArgs<ExtArgs>
    sections?: boolean | courses$sectionsArgs<ExtArgs>
    assessment_questions?: boolean | courses$assessment_questionsArgs<ExtArgs>
    user_assessments?: boolean | courses$user_assessmentsArgs<ExtArgs>
    _count?: boolean | CoursesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["courses"]>

  export type coursesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    title?: boolean
    description?: boolean
    thumbnail?: boolean
    status?: boolean
    students?: boolean
    lessons?: boolean
    duration?: boolean
    rating?: boolean
    category?: boolean
    difficulty?: boolean
    creatorId?: boolean
    outcomes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["courses"]>

  export type coursesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    title?: boolean
    description?: boolean
    thumbnail?: boolean
    status?: boolean
    students?: boolean
    lessons?: boolean
    duration?: boolean
    rating?: boolean
    category?: boolean
    difficulty?: boolean
    creatorId?: boolean
    outcomes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["courses"]>

  export type coursesSelectScalar = {
    id?: boolean
    slug?: boolean
    title?: boolean
    description?: boolean
    thumbnail?: boolean
    status?: boolean
    students?: boolean
    lessons?: boolean
    duration?: boolean
    rating?: boolean
    category?: boolean
    difficulty?: boolean
    creatorId?: boolean
    outcomes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type coursesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "slug" | "title" | "description" | "thumbnail" | "status" | "students" | "lessons" | "duration" | "rating" | "category" | "difficulty" | "creatorId" | "outcomes" | "createdAt" | "updatedAt", ExtArgs["result"]["courses"]>
  export type coursesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enrollments?: boolean | courses$enrollmentsArgs<ExtArgs>
    sections?: boolean | courses$sectionsArgs<ExtArgs>
    assessment_questions?: boolean | courses$assessment_questionsArgs<ExtArgs>
    user_assessments?: boolean | courses$user_assessmentsArgs<ExtArgs>
    _count?: boolean | CoursesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type coursesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type coursesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $coursesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "courses"
    objects: {
      enrollments: Prisma.$enrollmentsPayload<ExtArgs>[]
      sections: Prisma.$sectionsPayload<ExtArgs>[]
      assessment_questions: Prisma.$assessment_questionsPayload<ExtArgs>[]
      user_assessments: Prisma.$user_assessmentsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      title: string
      description: string
      thumbnail: string | null
      status: $Enums.CourseStatus
      students: number
      lessons: number
      duration: string
      rating: number
      category: string
      difficulty: string | null
      creatorId: string
      outcomes: string[]
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["courses"]>
    composites: {}
  }

  type coursesGetPayload<S extends boolean | null | undefined | coursesDefaultArgs> = $Result.GetResult<Prisma.$coursesPayload, S>

  type coursesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<coursesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: CoursesCountAggregateInputType | true
    }

  export interface coursesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['courses'], meta: { name: 'courses' } }
    /**
     * Find zero or one Courses that matches the filter.
     * @param {coursesFindUniqueArgs} args - Arguments to find a Courses
     * @example
     * // Get one Courses
     * const courses = await prisma.courses.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends coursesFindUniqueArgs>(args: SelectSubset<T, coursesFindUniqueArgs<ExtArgs>>): Prisma__coursesClient<$Result.GetResult<Prisma.$coursesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Courses that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {coursesFindUniqueOrThrowArgs} args - Arguments to find a Courses
     * @example
     * // Get one Courses
     * const courses = await prisma.courses.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends coursesFindUniqueOrThrowArgs>(args: SelectSubset<T, coursesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__coursesClient<$Result.GetResult<Prisma.$coursesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Courses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {coursesFindFirstArgs} args - Arguments to find a Courses
     * @example
     * // Get one Courses
     * const courses = await prisma.courses.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends coursesFindFirstArgs>(args?: SelectSubset<T, coursesFindFirstArgs<ExtArgs>>): Prisma__coursesClient<$Result.GetResult<Prisma.$coursesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Courses that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {coursesFindFirstOrThrowArgs} args - Arguments to find a Courses
     * @example
     * // Get one Courses
     * const courses = await prisma.courses.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends coursesFindFirstOrThrowArgs>(args?: SelectSubset<T, coursesFindFirstOrThrowArgs<ExtArgs>>): Prisma__coursesClient<$Result.GetResult<Prisma.$coursesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Courses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {coursesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Courses
     * const courses = await prisma.courses.findMany()
     * 
     * // Get first 10 Courses
     * const courses = await prisma.courses.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const coursesWithIdOnly = await prisma.courses.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends coursesFindManyArgs>(args?: SelectSubset<T, coursesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$coursesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Courses.
     * @param {coursesCreateArgs} args - Arguments to create a Courses.
     * @example
     * // Create one Courses
     * const Courses = await prisma.courses.create({
     *   data: {
     *     // ... data to create a Courses
     *   }
     * })
     * 
     */
    create<T extends coursesCreateArgs>(args: SelectSubset<T, coursesCreateArgs<ExtArgs>>): Prisma__coursesClient<$Result.GetResult<Prisma.$coursesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Courses.
     * @param {coursesCreateManyArgs} args - Arguments to create many Courses.
     * @example
     * // Create many Courses
     * const courses = await prisma.courses.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends coursesCreateManyArgs>(args?: SelectSubset<T, coursesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Courses and returns the data saved in the database.
     * @param {coursesCreateManyAndReturnArgs} args - Arguments to create many Courses.
     * @example
     * // Create many Courses
     * const courses = await prisma.courses.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Courses and only return the `id`
     * const coursesWithIdOnly = await prisma.courses.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends coursesCreateManyAndReturnArgs>(args?: SelectSubset<T, coursesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$coursesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Courses.
     * @param {coursesDeleteArgs} args - Arguments to delete one Courses.
     * @example
     * // Delete one Courses
     * const Courses = await prisma.courses.delete({
     *   where: {
     *     // ... filter to delete one Courses
     *   }
     * })
     * 
     */
    delete<T extends coursesDeleteArgs>(args: SelectSubset<T, coursesDeleteArgs<ExtArgs>>): Prisma__coursesClient<$Result.GetResult<Prisma.$coursesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Courses.
     * @param {coursesUpdateArgs} args - Arguments to update one Courses.
     * @example
     * // Update one Courses
     * const courses = await prisma.courses.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends coursesUpdateArgs>(args: SelectSubset<T, coursesUpdateArgs<ExtArgs>>): Prisma__coursesClient<$Result.GetResult<Prisma.$coursesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Courses.
     * @param {coursesDeleteManyArgs} args - Arguments to filter Courses to delete.
     * @example
     * // Delete a few Courses
     * const { count } = await prisma.courses.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends coursesDeleteManyArgs>(args?: SelectSubset<T, coursesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Courses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {coursesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Courses
     * const courses = await prisma.courses.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends coursesUpdateManyArgs>(args: SelectSubset<T, coursesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Courses and returns the data updated in the database.
     * @param {coursesUpdateManyAndReturnArgs} args - Arguments to update many Courses.
     * @example
     * // Update many Courses
     * const courses = await prisma.courses.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Courses and only return the `id`
     * const coursesWithIdOnly = await prisma.courses.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends coursesUpdateManyAndReturnArgs>(args: SelectSubset<T, coursesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$coursesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Courses.
     * @param {coursesUpsertArgs} args - Arguments to update or create a Courses.
     * @example
     * // Update or create a Courses
     * const courses = await prisma.courses.upsert({
     *   create: {
     *     // ... data to create a Courses
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Courses we want to update
     *   }
     * })
     */
    upsert<T extends coursesUpsertArgs>(args: SelectSubset<T, coursesUpsertArgs<ExtArgs>>): Prisma__coursesClient<$Result.GetResult<Prisma.$coursesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Courses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {coursesCountArgs} args - Arguments to filter Courses to count.
     * @example
     * // Count the number of Courses
     * const count = await prisma.courses.count({
     *   where: {
     *     // ... the filter for the Courses we want to count
     *   }
     * })
    **/
    count<T extends coursesCountArgs>(
      args?: Subset<T, coursesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CoursesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Courses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CoursesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CoursesAggregateArgs>(args: Subset<T, CoursesAggregateArgs>): Prisma.PrismaPromise<GetCoursesAggregateType<T>>

    /**
     * Group by Courses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {coursesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends coursesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: coursesGroupByArgs['orderBy'] }
        : { orderBy?: coursesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, coursesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCoursesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the courses model
   */
  readonly fields: coursesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for courses.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__coursesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    enrollments<T extends courses$enrollmentsArgs<ExtArgs> = {}>(args?: Subset<T, courses$enrollmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$enrollmentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sections<T extends courses$sectionsArgs<ExtArgs> = {}>(args?: Subset<T, courses$sectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sectionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    assessment_questions<T extends courses$assessment_questionsArgs<ExtArgs> = {}>(args?: Subset<T, courses$assessment_questionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$assessment_questionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user_assessments<T extends courses$user_assessmentsArgs<ExtArgs> = {}>(args?: Subset<T, courses$user_assessmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_assessmentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the courses model
   */
  interface coursesFieldRefs {
    readonly id: FieldRef<"courses", 'String'>
    readonly slug: FieldRef<"courses", 'String'>
    readonly title: FieldRef<"courses", 'String'>
    readonly description: FieldRef<"courses", 'String'>
    readonly thumbnail: FieldRef<"courses", 'String'>
    readonly status: FieldRef<"courses", 'CourseStatus'>
    readonly students: FieldRef<"courses", 'Int'>
    readonly lessons: FieldRef<"courses", 'Int'>
    readonly duration: FieldRef<"courses", 'String'>
    readonly rating: FieldRef<"courses", 'Float'>
    readonly category: FieldRef<"courses", 'String'>
    readonly difficulty: FieldRef<"courses", 'String'>
    readonly creatorId: FieldRef<"courses", 'String'>
    readonly outcomes: FieldRef<"courses", 'String[]'>
    readonly createdAt: FieldRef<"courses", 'DateTime'>
    readonly updatedAt: FieldRef<"courses", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * courses findUnique
   */
  export type coursesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the courses
     */
    select?: coursesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the courses
     */
    omit?: coursesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: coursesInclude<ExtArgs> | null
    /**
     * Filter, which courses to fetch.
     */
    where: coursesWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * courses findUniqueOrThrow
   */
  export type coursesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the courses
     */
    select?: coursesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the courses
     */
    omit?: coursesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: coursesInclude<ExtArgs> | null
    /**
     * Filter, which courses to fetch.
     */
    where: coursesWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * courses findFirst
   */
  export type coursesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the courses
     */
    select?: coursesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the courses
     */
    omit?: coursesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: coursesInclude<ExtArgs> | null
    /**
     * Filter, which courses to fetch.
     */
    where?: coursesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of courses to fetch.
     */
    orderBy?: coursesOrderByWithRelationInput | coursesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for courses.
     */
    cursor?: coursesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` courses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of courses.
     */
    distinct?: CoursesScalarFieldEnum | CoursesScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * courses findFirstOrThrow
   */
  export type coursesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the courses
     */
    select?: coursesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the courses
     */
    omit?: coursesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: coursesInclude<ExtArgs> | null
    /**
     * Filter, which courses to fetch.
     */
    where?: coursesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of courses to fetch.
     */
    orderBy?: coursesOrderByWithRelationInput | coursesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for courses.
     */
    cursor?: coursesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` courses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of courses.
     */
    distinct?: CoursesScalarFieldEnum | CoursesScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * courses findMany
   */
  export type coursesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the courses
     */
    select?: coursesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the courses
     */
    omit?: coursesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: coursesInclude<ExtArgs> | null
    /**
     * Filter, which courses to fetch.
     */
    where?: coursesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of courses to fetch.
     */
    orderBy?: coursesOrderByWithRelationInput | coursesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing courses.
     */
    cursor?: coursesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` courses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` courses.
     */
    skip?: number
    distinct?: CoursesScalarFieldEnum | CoursesScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * courses create
   */
  export type coursesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the courses
     */
    select?: coursesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the courses
     */
    omit?: coursesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: coursesInclude<ExtArgs> | null
    /**
     * The data needed to create a courses.
     */
    data: XOR<coursesCreateInput, coursesUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * courses createMany
   */
  export type coursesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many courses.
     */
    data: coursesCreateManyInput | coursesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * courses createManyAndReturn
   */
  export type coursesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the courses
     */
    select?: coursesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the courses
     */
    omit?: coursesOmit<ExtArgs> | null
    /**
     * The data used to create many courses.
     */
    data: coursesCreateManyInput | coursesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * courses update
   */
  export type coursesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the courses
     */
    select?: coursesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the courses
     */
    omit?: coursesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: coursesInclude<ExtArgs> | null
    /**
     * The data needed to update a courses.
     */
    data: XOR<coursesUpdateInput, coursesUncheckedUpdateInput>
    /**
     * Choose, which courses to update.
     */
    where: coursesWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * courses updateMany
   */
  export type coursesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update courses.
     */
    data: XOR<coursesUpdateManyMutationInput, coursesUncheckedUpdateManyInput>
    /**
     * Filter which courses to update
     */
    where?: coursesWhereInput
    /**
     * Limit how many courses to update.
     */
    limit?: number
  }

  /**
   * courses updateManyAndReturn
   */
  export type coursesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the courses
     */
    select?: coursesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the courses
     */
    omit?: coursesOmit<ExtArgs> | null
    /**
     * The data used to update courses.
     */
    data: XOR<coursesUpdateManyMutationInput, coursesUncheckedUpdateManyInput>
    /**
     * Filter which courses to update
     */
    where?: coursesWhereInput
    /**
     * Limit how many courses to update.
     */
    limit?: number
  }

  /**
   * courses upsert
   */
  export type coursesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the courses
     */
    select?: coursesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the courses
     */
    omit?: coursesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: coursesInclude<ExtArgs> | null
    /**
     * The filter to search for the courses to update in case it exists.
     */
    where: coursesWhereUniqueInput
    /**
     * In case the courses found by the `where` argument doesn't exist, create a new courses with this data.
     */
    create: XOR<coursesCreateInput, coursesUncheckedCreateInput>
    /**
     * In case the courses was found with the provided `where` argument, update it with this data.
     */
    update: XOR<coursesUpdateInput, coursesUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * courses delete
   */
  export type coursesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the courses
     */
    select?: coursesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the courses
     */
    omit?: coursesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: coursesInclude<ExtArgs> | null
    /**
     * Filter which courses to delete.
     */
    where: coursesWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * courses deleteMany
   */
  export type coursesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which courses to delete
     */
    where?: coursesWhereInput
    /**
     * Limit how many courses to delete.
     */
    limit?: number
  }

  /**
   * courses.enrollments
   */
  export type courses$enrollmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the enrollments
     */
    select?: enrollmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the enrollments
     */
    omit?: enrollmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: enrollmentsInclude<ExtArgs> | null
    where?: enrollmentsWhereInput
    orderBy?: enrollmentsOrderByWithRelationInput | enrollmentsOrderByWithRelationInput[]
    cursor?: enrollmentsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EnrollmentsScalarFieldEnum | EnrollmentsScalarFieldEnum[]
  }

  /**
   * courses.sections
   */
  export type courses$sectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sections
     */
    select?: sectionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sections
     */
    omit?: sectionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sectionsInclude<ExtArgs> | null
    where?: sectionsWhereInput
    orderBy?: sectionsOrderByWithRelationInput | sectionsOrderByWithRelationInput[]
    cursor?: sectionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SectionsScalarFieldEnum | SectionsScalarFieldEnum[]
  }

  /**
   * courses.assessment_questions
   */
  export type courses$assessment_questionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the assessment_questions
     */
    select?: assessment_questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the assessment_questions
     */
    omit?: assessment_questionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: assessment_questionsInclude<ExtArgs> | null
    where?: assessment_questionsWhereInput
    orderBy?: assessment_questionsOrderByWithRelationInput | assessment_questionsOrderByWithRelationInput[]
    cursor?: assessment_questionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Assessment_questionsScalarFieldEnum | Assessment_questionsScalarFieldEnum[]
  }

  /**
   * courses.user_assessments
   */
  export type courses$user_assessmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_assessments
     */
    select?: user_assessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_assessments
     */
    omit?: user_assessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_assessmentsInclude<ExtArgs> | null
    where?: user_assessmentsWhereInput
    orderBy?: user_assessmentsOrderByWithRelationInput | user_assessmentsOrderByWithRelationInput[]
    cursor?: user_assessmentsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: User_assessmentsScalarFieldEnum | User_assessmentsScalarFieldEnum[]
  }

  /**
   * courses without action
   */
  export type coursesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the courses
     */
    select?: coursesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the courses
     */
    omit?: coursesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: coursesInclude<ExtArgs> | null
  }


  /**
   * Model enrollments
   */

  export type AggregateEnrollments = {
    _count: EnrollmentsCountAggregateOutputType | null
    _min: EnrollmentsMinAggregateOutputType | null
    _max: EnrollmentsMaxAggregateOutputType | null
  }

  export type EnrollmentsMinAggregateOutputType = {
    id: string | null
    userId: string | null
    courseId: string | null
    enrolledAt: Date | null
    completed: boolean | null
    completedAt: Date | null
  }

  export type EnrollmentsMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    courseId: string | null
    enrolledAt: Date | null
    completed: boolean | null
    completedAt: Date | null
  }

  export type EnrollmentsCountAggregateOutputType = {
    id: number
    userId: number
    courseId: number
    enrolledAt: number
    completed: number
    completedAt: number
    _all: number
  }


  export type EnrollmentsMinAggregateInputType = {
    id?: true
    userId?: true
    courseId?: true
    enrolledAt?: true
    completed?: true
    completedAt?: true
  }

  export type EnrollmentsMaxAggregateInputType = {
    id?: true
    userId?: true
    courseId?: true
    enrolledAt?: true
    completed?: true
    completedAt?: true
  }

  export type EnrollmentsCountAggregateInputType = {
    id?: true
    userId?: true
    courseId?: true
    enrolledAt?: true
    completed?: true
    completedAt?: true
    _all?: true
  }

  export type EnrollmentsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which enrollments to aggregate.
     */
    where?: enrollmentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of enrollments to fetch.
     */
    orderBy?: enrollmentsOrderByWithRelationInput | enrollmentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: enrollmentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` enrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` enrollments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned enrollments
    **/
    _count?: true | EnrollmentsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EnrollmentsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EnrollmentsMaxAggregateInputType
  }

  export type GetEnrollmentsAggregateType<T extends EnrollmentsAggregateArgs> = {
        [P in keyof T & keyof AggregateEnrollments]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEnrollments[P]>
      : GetScalarType<T[P], AggregateEnrollments[P]>
  }




  export type enrollmentsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: enrollmentsWhereInput
    orderBy?: enrollmentsOrderByWithAggregationInput | enrollmentsOrderByWithAggregationInput[]
    by: EnrollmentsScalarFieldEnum[] | EnrollmentsScalarFieldEnum
    having?: enrollmentsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EnrollmentsCountAggregateInputType | true
    _min?: EnrollmentsMinAggregateInputType
    _max?: EnrollmentsMaxAggregateInputType
  }

  export type EnrollmentsGroupByOutputType = {
    id: string
    userId: string
    courseId: string
    enrolledAt: Date
    completed: boolean
    completedAt: Date | null
    _count: EnrollmentsCountAggregateOutputType | null
    _min: EnrollmentsMinAggregateOutputType | null
    _max: EnrollmentsMaxAggregateOutputType | null
  }

  type GetEnrollmentsGroupByPayload<T extends enrollmentsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EnrollmentsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EnrollmentsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EnrollmentsGroupByOutputType[P]>
            : GetScalarType<T[P], EnrollmentsGroupByOutputType[P]>
        }
      >
    >


  export type enrollmentsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    courseId?: boolean
    enrolledAt?: boolean
    completed?: boolean
    completedAt?: boolean
    courses?: boolean | coursesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["enrollments"]>

  export type enrollmentsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    courseId?: boolean
    enrolledAt?: boolean
    completed?: boolean
    completedAt?: boolean
    courses?: boolean | coursesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["enrollments"]>

  export type enrollmentsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    courseId?: boolean
    enrolledAt?: boolean
    completed?: boolean
    completedAt?: boolean
    courses?: boolean | coursesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["enrollments"]>

  export type enrollmentsSelectScalar = {
    id?: boolean
    userId?: boolean
    courseId?: boolean
    enrolledAt?: boolean
    completed?: boolean
    completedAt?: boolean
  }

  export type enrollmentsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "courseId" | "enrolledAt" | "completed" | "completedAt", ExtArgs["result"]["enrollments"]>
  export type enrollmentsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courses?: boolean | coursesDefaultArgs<ExtArgs>
  }
  export type enrollmentsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courses?: boolean | coursesDefaultArgs<ExtArgs>
  }
  export type enrollmentsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courses?: boolean | coursesDefaultArgs<ExtArgs>
  }

  export type $enrollmentsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "enrollments"
    objects: {
      courses: Prisma.$coursesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      courseId: string
      enrolledAt: Date
      completed: boolean
      completedAt: Date | null
    }, ExtArgs["result"]["enrollments"]>
    composites: {}
  }

  type enrollmentsGetPayload<S extends boolean | null | undefined | enrollmentsDefaultArgs> = $Result.GetResult<Prisma.$enrollmentsPayload, S>

  type enrollmentsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<enrollmentsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: EnrollmentsCountAggregateInputType | true
    }

  export interface enrollmentsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['enrollments'], meta: { name: 'enrollments' } }
    /**
     * Find zero or one Enrollments that matches the filter.
     * @param {enrollmentsFindUniqueArgs} args - Arguments to find a Enrollments
     * @example
     * // Get one Enrollments
     * const enrollments = await prisma.enrollments.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends enrollmentsFindUniqueArgs>(args: SelectSubset<T, enrollmentsFindUniqueArgs<ExtArgs>>): Prisma__enrollmentsClient<$Result.GetResult<Prisma.$enrollmentsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Enrollments that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {enrollmentsFindUniqueOrThrowArgs} args - Arguments to find a Enrollments
     * @example
     * // Get one Enrollments
     * const enrollments = await prisma.enrollments.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends enrollmentsFindUniqueOrThrowArgs>(args: SelectSubset<T, enrollmentsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__enrollmentsClient<$Result.GetResult<Prisma.$enrollmentsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Enrollments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {enrollmentsFindFirstArgs} args - Arguments to find a Enrollments
     * @example
     * // Get one Enrollments
     * const enrollments = await prisma.enrollments.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends enrollmentsFindFirstArgs>(args?: SelectSubset<T, enrollmentsFindFirstArgs<ExtArgs>>): Prisma__enrollmentsClient<$Result.GetResult<Prisma.$enrollmentsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Enrollments that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {enrollmentsFindFirstOrThrowArgs} args - Arguments to find a Enrollments
     * @example
     * // Get one Enrollments
     * const enrollments = await prisma.enrollments.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends enrollmentsFindFirstOrThrowArgs>(args?: SelectSubset<T, enrollmentsFindFirstOrThrowArgs<ExtArgs>>): Prisma__enrollmentsClient<$Result.GetResult<Prisma.$enrollmentsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Enrollments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {enrollmentsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Enrollments
     * const enrollments = await prisma.enrollments.findMany()
     * 
     * // Get first 10 Enrollments
     * const enrollments = await prisma.enrollments.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const enrollmentsWithIdOnly = await prisma.enrollments.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends enrollmentsFindManyArgs>(args?: SelectSubset<T, enrollmentsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$enrollmentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Enrollments.
     * @param {enrollmentsCreateArgs} args - Arguments to create a Enrollments.
     * @example
     * // Create one Enrollments
     * const Enrollments = await prisma.enrollments.create({
     *   data: {
     *     // ... data to create a Enrollments
     *   }
     * })
     * 
     */
    create<T extends enrollmentsCreateArgs>(args: SelectSubset<T, enrollmentsCreateArgs<ExtArgs>>): Prisma__enrollmentsClient<$Result.GetResult<Prisma.$enrollmentsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Enrollments.
     * @param {enrollmentsCreateManyArgs} args - Arguments to create many Enrollments.
     * @example
     * // Create many Enrollments
     * const enrollments = await prisma.enrollments.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends enrollmentsCreateManyArgs>(args?: SelectSubset<T, enrollmentsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Enrollments and returns the data saved in the database.
     * @param {enrollmentsCreateManyAndReturnArgs} args - Arguments to create many Enrollments.
     * @example
     * // Create many Enrollments
     * const enrollments = await prisma.enrollments.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Enrollments and only return the `id`
     * const enrollmentsWithIdOnly = await prisma.enrollments.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends enrollmentsCreateManyAndReturnArgs>(args?: SelectSubset<T, enrollmentsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$enrollmentsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Enrollments.
     * @param {enrollmentsDeleteArgs} args - Arguments to delete one Enrollments.
     * @example
     * // Delete one Enrollments
     * const Enrollments = await prisma.enrollments.delete({
     *   where: {
     *     // ... filter to delete one Enrollments
     *   }
     * })
     * 
     */
    delete<T extends enrollmentsDeleteArgs>(args: SelectSubset<T, enrollmentsDeleteArgs<ExtArgs>>): Prisma__enrollmentsClient<$Result.GetResult<Prisma.$enrollmentsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Enrollments.
     * @param {enrollmentsUpdateArgs} args - Arguments to update one Enrollments.
     * @example
     * // Update one Enrollments
     * const enrollments = await prisma.enrollments.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends enrollmentsUpdateArgs>(args: SelectSubset<T, enrollmentsUpdateArgs<ExtArgs>>): Prisma__enrollmentsClient<$Result.GetResult<Prisma.$enrollmentsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Enrollments.
     * @param {enrollmentsDeleteManyArgs} args - Arguments to filter Enrollments to delete.
     * @example
     * // Delete a few Enrollments
     * const { count } = await prisma.enrollments.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends enrollmentsDeleteManyArgs>(args?: SelectSubset<T, enrollmentsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Enrollments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {enrollmentsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Enrollments
     * const enrollments = await prisma.enrollments.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends enrollmentsUpdateManyArgs>(args: SelectSubset<T, enrollmentsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Enrollments and returns the data updated in the database.
     * @param {enrollmentsUpdateManyAndReturnArgs} args - Arguments to update many Enrollments.
     * @example
     * // Update many Enrollments
     * const enrollments = await prisma.enrollments.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Enrollments and only return the `id`
     * const enrollmentsWithIdOnly = await prisma.enrollments.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends enrollmentsUpdateManyAndReturnArgs>(args: SelectSubset<T, enrollmentsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$enrollmentsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Enrollments.
     * @param {enrollmentsUpsertArgs} args - Arguments to update or create a Enrollments.
     * @example
     * // Update or create a Enrollments
     * const enrollments = await prisma.enrollments.upsert({
     *   create: {
     *     // ... data to create a Enrollments
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Enrollments we want to update
     *   }
     * })
     */
    upsert<T extends enrollmentsUpsertArgs>(args: SelectSubset<T, enrollmentsUpsertArgs<ExtArgs>>): Prisma__enrollmentsClient<$Result.GetResult<Prisma.$enrollmentsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Enrollments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {enrollmentsCountArgs} args - Arguments to filter Enrollments to count.
     * @example
     * // Count the number of Enrollments
     * const count = await prisma.enrollments.count({
     *   where: {
     *     // ... the filter for the Enrollments we want to count
     *   }
     * })
    **/
    count<T extends enrollmentsCountArgs>(
      args?: Subset<T, enrollmentsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EnrollmentsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Enrollments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrollmentsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EnrollmentsAggregateArgs>(args: Subset<T, EnrollmentsAggregateArgs>): Prisma.PrismaPromise<GetEnrollmentsAggregateType<T>>

    /**
     * Group by Enrollments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {enrollmentsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends enrollmentsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: enrollmentsGroupByArgs['orderBy'] }
        : { orderBy?: enrollmentsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, enrollmentsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnrollmentsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the enrollments model
   */
  readonly fields: enrollmentsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for enrollments.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__enrollmentsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    courses<T extends coursesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, coursesDefaultArgs<ExtArgs>>): Prisma__coursesClient<$Result.GetResult<Prisma.$coursesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the enrollments model
   */
  interface enrollmentsFieldRefs {
    readonly id: FieldRef<"enrollments", 'String'>
    readonly userId: FieldRef<"enrollments", 'String'>
    readonly courseId: FieldRef<"enrollments", 'String'>
    readonly enrolledAt: FieldRef<"enrollments", 'DateTime'>
    readonly completed: FieldRef<"enrollments", 'Boolean'>
    readonly completedAt: FieldRef<"enrollments", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * enrollments findUnique
   */
  export type enrollmentsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the enrollments
     */
    select?: enrollmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the enrollments
     */
    omit?: enrollmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: enrollmentsInclude<ExtArgs> | null
    /**
     * Filter, which enrollments to fetch.
     */
    where: enrollmentsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * enrollments findUniqueOrThrow
   */
  export type enrollmentsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the enrollments
     */
    select?: enrollmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the enrollments
     */
    omit?: enrollmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: enrollmentsInclude<ExtArgs> | null
    /**
     * Filter, which enrollments to fetch.
     */
    where: enrollmentsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * enrollments findFirst
   */
  export type enrollmentsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the enrollments
     */
    select?: enrollmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the enrollments
     */
    omit?: enrollmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: enrollmentsInclude<ExtArgs> | null
    /**
     * Filter, which enrollments to fetch.
     */
    where?: enrollmentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of enrollments to fetch.
     */
    orderBy?: enrollmentsOrderByWithRelationInput | enrollmentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for enrollments.
     */
    cursor?: enrollmentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` enrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` enrollments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of enrollments.
     */
    distinct?: EnrollmentsScalarFieldEnum | EnrollmentsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * enrollments findFirstOrThrow
   */
  export type enrollmentsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the enrollments
     */
    select?: enrollmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the enrollments
     */
    omit?: enrollmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: enrollmentsInclude<ExtArgs> | null
    /**
     * Filter, which enrollments to fetch.
     */
    where?: enrollmentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of enrollments to fetch.
     */
    orderBy?: enrollmentsOrderByWithRelationInput | enrollmentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for enrollments.
     */
    cursor?: enrollmentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` enrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` enrollments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of enrollments.
     */
    distinct?: EnrollmentsScalarFieldEnum | EnrollmentsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * enrollments findMany
   */
  export type enrollmentsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the enrollments
     */
    select?: enrollmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the enrollments
     */
    omit?: enrollmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: enrollmentsInclude<ExtArgs> | null
    /**
     * Filter, which enrollments to fetch.
     */
    where?: enrollmentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of enrollments to fetch.
     */
    orderBy?: enrollmentsOrderByWithRelationInput | enrollmentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing enrollments.
     */
    cursor?: enrollmentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` enrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` enrollments.
     */
    skip?: number
    distinct?: EnrollmentsScalarFieldEnum | EnrollmentsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * enrollments create
   */
  export type enrollmentsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the enrollments
     */
    select?: enrollmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the enrollments
     */
    omit?: enrollmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: enrollmentsInclude<ExtArgs> | null
    /**
     * The data needed to create a enrollments.
     */
    data: XOR<enrollmentsCreateInput, enrollmentsUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * enrollments createMany
   */
  export type enrollmentsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many enrollments.
     */
    data: enrollmentsCreateManyInput | enrollmentsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * enrollments createManyAndReturn
   */
  export type enrollmentsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the enrollments
     */
    select?: enrollmentsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the enrollments
     */
    omit?: enrollmentsOmit<ExtArgs> | null
    /**
     * The data used to create many enrollments.
     */
    data: enrollmentsCreateManyInput | enrollmentsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: enrollmentsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * enrollments update
   */
  export type enrollmentsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the enrollments
     */
    select?: enrollmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the enrollments
     */
    omit?: enrollmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: enrollmentsInclude<ExtArgs> | null
    /**
     * The data needed to update a enrollments.
     */
    data: XOR<enrollmentsUpdateInput, enrollmentsUncheckedUpdateInput>
    /**
     * Choose, which enrollments to update.
     */
    where: enrollmentsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * enrollments updateMany
   */
  export type enrollmentsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update enrollments.
     */
    data: XOR<enrollmentsUpdateManyMutationInput, enrollmentsUncheckedUpdateManyInput>
    /**
     * Filter which enrollments to update
     */
    where?: enrollmentsWhereInput
    /**
     * Limit how many enrollments to update.
     */
    limit?: number
  }

  /**
   * enrollments updateManyAndReturn
   */
  export type enrollmentsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the enrollments
     */
    select?: enrollmentsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the enrollments
     */
    omit?: enrollmentsOmit<ExtArgs> | null
    /**
     * The data used to update enrollments.
     */
    data: XOR<enrollmentsUpdateManyMutationInput, enrollmentsUncheckedUpdateManyInput>
    /**
     * Filter which enrollments to update
     */
    where?: enrollmentsWhereInput
    /**
     * Limit how many enrollments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: enrollmentsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * enrollments upsert
   */
  export type enrollmentsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the enrollments
     */
    select?: enrollmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the enrollments
     */
    omit?: enrollmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: enrollmentsInclude<ExtArgs> | null
    /**
     * The filter to search for the enrollments to update in case it exists.
     */
    where: enrollmentsWhereUniqueInput
    /**
     * In case the enrollments found by the `where` argument doesn't exist, create a new enrollments with this data.
     */
    create: XOR<enrollmentsCreateInput, enrollmentsUncheckedCreateInput>
    /**
     * In case the enrollments was found with the provided `where` argument, update it with this data.
     */
    update: XOR<enrollmentsUpdateInput, enrollmentsUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * enrollments delete
   */
  export type enrollmentsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the enrollments
     */
    select?: enrollmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the enrollments
     */
    omit?: enrollmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: enrollmentsInclude<ExtArgs> | null
    /**
     * Filter which enrollments to delete.
     */
    where: enrollmentsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * enrollments deleteMany
   */
  export type enrollmentsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which enrollments to delete
     */
    where?: enrollmentsWhereInput
    /**
     * Limit how many enrollments to delete.
     */
    limit?: number
  }

  /**
   * enrollments without action
   */
  export type enrollmentsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the enrollments
     */
    select?: enrollmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the enrollments
     */
    omit?: enrollmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: enrollmentsInclude<ExtArgs> | null
  }


  /**
   * Model lesson_progress
   */

  export type AggregateLesson_progress = {
    _count: Lesson_progressCountAggregateOutputType | null
    _min: Lesson_progressMinAggregateOutputType | null
    _max: Lesson_progressMaxAggregateOutputType | null
  }

  export type Lesson_progressMinAggregateOutputType = {
    id: string | null
    lessonId: string | null
    userId: string | null
    completed: boolean | null
    completedAt: Date | null
    createdAt: Date | null
  }

  export type Lesson_progressMaxAggregateOutputType = {
    id: string | null
    lessonId: string | null
    userId: string | null
    completed: boolean | null
    completedAt: Date | null
    createdAt: Date | null
  }

  export type Lesson_progressCountAggregateOutputType = {
    id: number
    lessonId: number
    userId: number
    completed: number
    completedAt: number
    createdAt: number
    _all: number
  }


  export type Lesson_progressMinAggregateInputType = {
    id?: true
    lessonId?: true
    userId?: true
    completed?: true
    completedAt?: true
    createdAt?: true
  }

  export type Lesson_progressMaxAggregateInputType = {
    id?: true
    lessonId?: true
    userId?: true
    completed?: true
    completedAt?: true
    createdAt?: true
  }

  export type Lesson_progressCountAggregateInputType = {
    id?: true
    lessonId?: true
    userId?: true
    completed?: true
    completedAt?: true
    createdAt?: true
    _all?: true
  }

  export type Lesson_progressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which lesson_progress to aggregate.
     */
    where?: lesson_progressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lesson_progresses to fetch.
     */
    orderBy?: lesson_progressOrderByWithRelationInput | lesson_progressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: lesson_progressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lesson_progresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lesson_progresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned lesson_progresses
    **/
    _count?: true | Lesson_progressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Lesson_progressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Lesson_progressMaxAggregateInputType
  }

  export type GetLesson_progressAggregateType<T extends Lesson_progressAggregateArgs> = {
        [P in keyof T & keyof AggregateLesson_progress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLesson_progress[P]>
      : GetScalarType<T[P], AggregateLesson_progress[P]>
  }




  export type lesson_progressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: lesson_progressWhereInput
    orderBy?: lesson_progressOrderByWithAggregationInput | lesson_progressOrderByWithAggregationInput[]
    by: Lesson_progressScalarFieldEnum[] | Lesson_progressScalarFieldEnum
    having?: lesson_progressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Lesson_progressCountAggregateInputType | true
    _min?: Lesson_progressMinAggregateInputType
    _max?: Lesson_progressMaxAggregateInputType
  }

  export type Lesson_progressGroupByOutputType = {
    id: string
    lessonId: string
    userId: string
    completed: boolean
    completedAt: Date | null
    createdAt: Date
    _count: Lesson_progressCountAggregateOutputType | null
    _min: Lesson_progressMinAggregateOutputType | null
    _max: Lesson_progressMaxAggregateOutputType | null
  }

  type GetLesson_progressGroupByPayload<T extends lesson_progressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Lesson_progressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Lesson_progressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Lesson_progressGroupByOutputType[P]>
            : GetScalarType<T[P], Lesson_progressGroupByOutputType[P]>
        }
      >
    >


  export type lesson_progressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lessonId?: boolean
    userId?: boolean
    completed?: boolean
    completedAt?: boolean
    createdAt?: boolean
    lessons?: boolean | lessonsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lesson_progress"]>

  export type lesson_progressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lessonId?: boolean
    userId?: boolean
    completed?: boolean
    completedAt?: boolean
    createdAt?: boolean
    lessons?: boolean | lessonsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lesson_progress"]>

  export type lesson_progressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lessonId?: boolean
    userId?: boolean
    completed?: boolean
    completedAt?: boolean
    createdAt?: boolean
    lessons?: boolean | lessonsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lesson_progress"]>

  export type lesson_progressSelectScalar = {
    id?: boolean
    lessonId?: boolean
    userId?: boolean
    completed?: boolean
    completedAt?: boolean
    createdAt?: boolean
  }

  export type lesson_progressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "lessonId" | "userId" | "completed" | "completedAt" | "createdAt", ExtArgs["result"]["lesson_progress"]>
  export type lesson_progressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lessons?: boolean | lessonsDefaultArgs<ExtArgs>
  }
  export type lesson_progressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lessons?: boolean | lessonsDefaultArgs<ExtArgs>
  }
  export type lesson_progressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lessons?: boolean | lessonsDefaultArgs<ExtArgs>
  }

  export type $lesson_progressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "lesson_progress"
    objects: {
      lessons: Prisma.$lessonsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      lessonId: string
      userId: string
      completed: boolean
      completedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["lesson_progress"]>
    composites: {}
  }

  type lesson_progressGetPayload<S extends boolean | null | undefined | lesson_progressDefaultArgs> = $Result.GetResult<Prisma.$lesson_progressPayload, S>

  type lesson_progressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<lesson_progressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: Lesson_progressCountAggregateInputType | true
    }

  export interface lesson_progressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['lesson_progress'], meta: { name: 'lesson_progress' } }
    /**
     * Find zero or one Lesson_progress that matches the filter.
     * @param {lesson_progressFindUniqueArgs} args - Arguments to find a Lesson_progress
     * @example
     * // Get one Lesson_progress
     * const lesson_progress = await prisma.lesson_progress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends lesson_progressFindUniqueArgs>(args: SelectSubset<T, lesson_progressFindUniqueArgs<ExtArgs>>): Prisma__lesson_progressClient<$Result.GetResult<Prisma.$lesson_progressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Lesson_progress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {lesson_progressFindUniqueOrThrowArgs} args - Arguments to find a Lesson_progress
     * @example
     * // Get one Lesson_progress
     * const lesson_progress = await prisma.lesson_progress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends lesson_progressFindUniqueOrThrowArgs>(args: SelectSubset<T, lesson_progressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__lesson_progressClient<$Result.GetResult<Prisma.$lesson_progressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lesson_progress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lesson_progressFindFirstArgs} args - Arguments to find a Lesson_progress
     * @example
     * // Get one Lesson_progress
     * const lesson_progress = await prisma.lesson_progress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends lesson_progressFindFirstArgs>(args?: SelectSubset<T, lesson_progressFindFirstArgs<ExtArgs>>): Prisma__lesson_progressClient<$Result.GetResult<Prisma.$lesson_progressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lesson_progress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lesson_progressFindFirstOrThrowArgs} args - Arguments to find a Lesson_progress
     * @example
     * // Get one Lesson_progress
     * const lesson_progress = await prisma.lesson_progress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends lesson_progressFindFirstOrThrowArgs>(args?: SelectSubset<T, lesson_progressFindFirstOrThrowArgs<ExtArgs>>): Prisma__lesson_progressClient<$Result.GetResult<Prisma.$lesson_progressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Lesson_progresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lesson_progressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lesson_progresses
     * const lesson_progresses = await prisma.lesson_progress.findMany()
     * 
     * // Get first 10 Lesson_progresses
     * const lesson_progresses = await prisma.lesson_progress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lesson_progressWithIdOnly = await prisma.lesson_progress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends lesson_progressFindManyArgs>(args?: SelectSubset<T, lesson_progressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$lesson_progressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Lesson_progress.
     * @param {lesson_progressCreateArgs} args - Arguments to create a Lesson_progress.
     * @example
     * // Create one Lesson_progress
     * const Lesson_progress = await prisma.lesson_progress.create({
     *   data: {
     *     // ... data to create a Lesson_progress
     *   }
     * })
     * 
     */
    create<T extends lesson_progressCreateArgs>(args: SelectSubset<T, lesson_progressCreateArgs<ExtArgs>>): Prisma__lesson_progressClient<$Result.GetResult<Prisma.$lesson_progressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Lesson_progresses.
     * @param {lesson_progressCreateManyArgs} args - Arguments to create many Lesson_progresses.
     * @example
     * // Create many Lesson_progresses
     * const lesson_progress = await prisma.lesson_progress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends lesson_progressCreateManyArgs>(args?: SelectSubset<T, lesson_progressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Lesson_progresses and returns the data saved in the database.
     * @param {lesson_progressCreateManyAndReturnArgs} args - Arguments to create many Lesson_progresses.
     * @example
     * // Create many Lesson_progresses
     * const lesson_progress = await prisma.lesson_progress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Lesson_progresses and only return the `id`
     * const lesson_progressWithIdOnly = await prisma.lesson_progress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends lesson_progressCreateManyAndReturnArgs>(args?: SelectSubset<T, lesson_progressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$lesson_progressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Lesson_progress.
     * @param {lesson_progressDeleteArgs} args - Arguments to delete one Lesson_progress.
     * @example
     * // Delete one Lesson_progress
     * const Lesson_progress = await prisma.lesson_progress.delete({
     *   where: {
     *     // ... filter to delete one Lesson_progress
     *   }
     * })
     * 
     */
    delete<T extends lesson_progressDeleteArgs>(args: SelectSubset<T, lesson_progressDeleteArgs<ExtArgs>>): Prisma__lesson_progressClient<$Result.GetResult<Prisma.$lesson_progressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Lesson_progress.
     * @param {lesson_progressUpdateArgs} args - Arguments to update one Lesson_progress.
     * @example
     * // Update one Lesson_progress
     * const lesson_progress = await prisma.lesson_progress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends lesson_progressUpdateArgs>(args: SelectSubset<T, lesson_progressUpdateArgs<ExtArgs>>): Prisma__lesson_progressClient<$Result.GetResult<Prisma.$lesson_progressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Lesson_progresses.
     * @param {lesson_progressDeleteManyArgs} args - Arguments to filter Lesson_progresses to delete.
     * @example
     * // Delete a few Lesson_progresses
     * const { count } = await prisma.lesson_progress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends lesson_progressDeleteManyArgs>(args?: SelectSubset<T, lesson_progressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lesson_progresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lesson_progressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lesson_progresses
     * const lesson_progress = await prisma.lesson_progress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends lesson_progressUpdateManyArgs>(args: SelectSubset<T, lesson_progressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lesson_progresses and returns the data updated in the database.
     * @param {lesson_progressUpdateManyAndReturnArgs} args - Arguments to update many Lesson_progresses.
     * @example
     * // Update many Lesson_progresses
     * const lesson_progress = await prisma.lesson_progress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Lesson_progresses and only return the `id`
     * const lesson_progressWithIdOnly = await prisma.lesson_progress.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends lesson_progressUpdateManyAndReturnArgs>(args: SelectSubset<T, lesson_progressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$lesson_progressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Lesson_progress.
     * @param {lesson_progressUpsertArgs} args - Arguments to update or create a Lesson_progress.
     * @example
     * // Update or create a Lesson_progress
     * const lesson_progress = await prisma.lesson_progress.upsert({
     *   create: {
     *     // ... data to create a Lesson_progress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lesson_progress we want to update
     *   }
     * })
     */
    upsert<T extends lesson_progressUpsertArgs>(args: SelectSubset<T, lesson_progressUpsertArgs<ExtArgs>>): Prisma__lesson_progressClient<$Result.GetResult<Prisma.$lesson_progressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Lesson_progresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lesson_progressCountArgs} args - Arguments to filter Lesson_progresses to count.
     * @example
     * // Count the number of Lesson_progresses
     * const count = await prisma.lesson_progress.count({
     *   where: {
     *     // ... the filter for the Lesson_progresses we want to count
     *   }
     * })
    **/
    count<T extends lesson_progressCountArgs>(
      args?: Subset<T, lesson_progressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Lesson_progressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lesson_progress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Lesson_progressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Lesson_progressAggregateArgs>(args: Subset<T, Lesson_progressAggregateArgs>): Prisma.PrismaPromise<GetLesson_progressAggregateType<T>>

    /**
     * Group by Lesson_progress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lesson_progressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends lesson_progressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: lesson_progressGroupByArgs['orderBy'] }
        : { orderBy?: lesson_progressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, lesson_progressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLesson_progressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the lesson_progress model
   */
  readonly fields: lesson_progressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for lesson_progress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__lesson_progressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lessons<T extends lessonsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, lessonsDefaultArgs<ExtArgs>>): Prisma__lessonsClient<$Result.GetResult<Prisma.$lessonsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the lesson_progress model
   */
  interface lesson_progressFieldRefs {
    readonly id: FieldRef<"lesson_progress", 'String'>
    readonly lessonId: FieldRef<"lesson_progress", 'String'>
    readonly userId: FieldRef<"lesson_progress", 'String'>
    readonly completed: FieldRef<"lesson_progress", 'Boolean'>
    readonly completedAt: FieldRef<"lesson_progress", 'DateTime'>
    readonly createdAt: FieldRef<"lesson_progress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * lesson_progress findUnique
   */
  export type lesson_progressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson_progress
     */
    select?: lesson_progressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson_progress
     */
    omit?: lesson_progressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lesson_progressInclude<ExtArgs> | null
    /**
     * Filter, which lesson_progress to fetch.
     */
    where: lesson_progressWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lesson_progress findUniqueOrThrow
   */
  export type lesson_progressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson_progress
     */
    select?: lesson_progressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson_progress
     */
    omit?: lesson_progressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lesson_progressInclude<ExtArgs> | null
    /**
     * Filter, which lesson_progress to fetch.
     */
    where: lesson_progressWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lesson_progress findFirst
   */
  export type lesson_progressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson_progress
     */
    select?: lesson_progressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson_progress
     */
    omit?: lesson_progressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lesson_progressInclude<ExtArgs> | null
    /**
     * Filter, which lesson_progress to fetch.
     */
    where?: lesson_progressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lesson_progresses to fetch.
     */
    orderBy?: lesson_progressOrderByWithRelationInput | lesson_progressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for lesson_progresses.
     */
    cursor?: lesson_progressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lesson_progresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lesson_progresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of lesson_progresses.
     */
    distinct?: Lesson_progressScalarFieldEnum | Lesson_progressScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lesson_progress findFirstOrThrow
   */
  export type lesson_progressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson_progress
     */
    select?: lesson_progressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson_progress
     */
    omit?: lesson_progressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lesson_progressInclude<ExtArgs> | null
    /**
     * Filter, which lesson_progress to fetch.
     */
    where?: lesson_progressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lesson_progresses to fetch.
     */
    orderBy?: lesson_progressOrderByWithRelationInput | lesson_progressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for lesson_progresses.
     */
    cursor?: lesson_progressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lesson_progresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lesson_progresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of lesson_progresses.
     */
    distinct?: Lesson_progressScalarFieldEnum | Lesson_progressScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lesson_progress findMany
   */
  export type lesson_progressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson_progress
     */
    select?: lesson_progressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson_progress
     */
    omit?: lesson_progressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lesson_progressInclude<ExtArgs> | null
    /**
     * Filter, which lesson_progresses to fetch.
     */
    where?: lesson_progressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lesson_progresses to fetch.
     */
    orderBy?: lesson_progressOrderByWithRelationInput | lesson_progressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing lesson_progresses.
     */
    cursor?: lesson_progressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lesson_progresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lesson_progresses.
     */
    skip?: number
    distinct?: Lesson_progressScalarFieldEnum | Lesson_progressScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lesson_progress create
   */
  export type lesson_progressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson_progress
     */
    select?: lesson_progressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson_progress
     */
    omit?: lesson_progressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lesson_progressInclude<ExtArgs> | null
    /**
     * The data needed to create a lesson_progress.
     */
    data: XOR<lesson_progressCreateInput, lesson_progressUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lesson_progress createMany
   */
  export type lesson_progressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many lesson_progresses.
     */
    data: lesson_progressCreateManyInput | lesson_progressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * lesson_progress createManyAndReturn
   */
  export type lesson_progressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson_progress
     */
    select?: lesson_progressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the lesson_progress
     */
    omit?: lesson_progressOmit<ExtArgs> | null
    /**
     * The data used to create many lesson_progresses.
     */
    data: lesson_progressCreateManyInput | lesson_progressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lesson_progressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * lesson_progress update
   */
  export type lesson_progressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson_progress
     */
    select?: lesson_progressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson_progress
     */
    omit?: lesson_progressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lesson_progressInclude<ExtArgs> | null
    /**
     * The data needed to update a lesson_progress.
     */
    data: XOR<lesson_progressUpdateInput, lesson_progressUncheckedUpdateInput>
    /**
     * Choose, which lesson_progress to update.
     */
    where: lesson_progressWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lesson_progress updateMany
   */
  export type lesson_progressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update lesson_progresses.
     */
    data: XOR<lesson_progressUpdateManyMutationInput, lesson_progressUncheckedUpdateManyInput>
    /**
     * Filter which lesson_progresses to update
     */
    where?: lesson_progressWhereInput
    /**
     * Limit how many lesson_progresses to update.
     */
    limit?: number
  }

  /**
   * lesson_progress updateManyAndReturn
   */
  export type lesson_progressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson_progress
     */
    select?: lesson_progressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the lesson_progress
     */
    omit?: lesson_progressOmit<ExtArgs> | null
    /**
     * The data used to update lesson_progresses.
     */
    data: XOR<lesson_progressUpdateManyMutationInput, lesson_progressUncheckedUpdateManyInput>
    /**
     * Filter which lesson_progresses to update
     */
    where?: lesson_progressWhereInput
    /**
     * Limit how many lesson_progresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lesson_progressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * lesson_progress upsert
   */
  export type lesson_progressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson_progress
     */
    select?: lesson_progressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson_progress
     */
    omit?: lesson_progressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lesson_progressInclude<ExtArgs> | null
    /**
     * The filter to search for the lesson_progress to update in case it exists.
     */
    where: lesson_progressWhereUniqueInput
    /**
     * In case the lesson_progress found by the `where` argument doesn't exist, create a new lesson_progress with this data.
     */
    create: XOR<lesson_progressCreateInput, lesson_progressUncheckedCreateInput>
    /**
     * In case the lesson_progress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<lesson_progressUpdateInput, lesson_progressUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lesson_progress delete
   */
  export type lesson_progressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson_progress
     */
    select?: lesson_progressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson_progress
     */
    omit?: lesson_progressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lesson_progressInclude<ExtArgs> | null
    /**
     * Filter which lesson_progress to delete.
     */
    where: lesson_progressWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lesson_progress deleteMany
   */
  export type lesson_progressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which lesson_progresses to delete
     */
    where?: lesson_progressWhereInput
    /**
     * Limit how many lesson_progresses to delete.
     */
    limit?: number
  }

  /**
   * lesson_progress without action
   */
  export type lesson_progressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson_progress
     */
    select?: lesson_progressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson_progress
     */
    omit?: lesson_progressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lesson_progressInclude<ExtArgs> | null
  }


  /**
   * Model lessons
   */

  export type AggregateLessons = {
    _count: LessonsCountAggregateOutputType | null
    _avg: LessonsAvgAggregateOutputType | null
    _sum: LessonsSumAggregateOutputType | null
    _min: LessonsMinAggregateOutputType | null
    _max: LessonsMaxAggregateOutputType | null
  }

  export type LessonsAvgAggregateOutputType = {
    order: number | null
  }

  export type LessonsSumAggregateOutputType = {
    order: number | null
  }

  export type LessonsMinAggregateOutputType = {
    id: string | null
    sectionId: string | null
    order: number | null
    title: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LessonsMaxAggregateOutputType = {
    id: string | null
    sectionId: string | null
    order: number | null
    title: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LessonsCountAggregateOutputType = {
    id: number
    sectionId: number
    order: number
    title: number
    content: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LessonsAvgAggregateInputType = {
    order?: true
  }

  export type LessonsSumAggregateInputType = {
    order?: true
  }

  export type LessonsMinAggregateInputType = {
    id?: true
    sectionId?: true
    order?: true
    title?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LessonsMaxAggregateInputType = {
    id?: true
    sectionId?: true
    order?: true
    title?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LessonsCountAggregateInputType = {
    id?: true
    sectionId?: true
    order?: true
    title?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LessonsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which lessons to aggregate.
     */
    where?: lessonsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lessons to fetch.
     */
    orderBy?: lessonsOrderByWithRelationInput | lessonsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: lessonsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned lessons
    **/
    _count?: true | LessonsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LessonsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LessonsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LessonsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LessonsMaxAggregateInputType
  }

  export type GetLessonsAggregateType<T extends LessonsAggregateArgs> = {
        [P in keyof T & keyof AggregateLessons]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLessons[P]>
      : GetScalarType<T[P], AggregateLessons[P]>
  }




  export type lessonsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: lessonsWhereInput
    orderBy?: lessonsOrderByWithAggregationInput | lessonsOrderByWithAggregationInput[]
    by: LessonsScalarFieldEnum[] | LessonsScalarFieldEnum
    having?: lessonsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LessonsCountAggregateInputType | true
    _avg?: LessonsAvgAggregateInputType
    _sum?: LessonsSumAggregateInputType
    _min?: LessonsMinAggregateInputType
    _max?: LessonsMaxAggregateInputType
  }

  export type LessonsGroupByOutputType = {
    id: string
    sectionId: string
    order: number
    title: string
    content: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: LessonsCountAggregateOutputType | null
    _avg: LessonsAvgAggregateOutputType | null
    _sum: LessonsSumAggregateOutputType | null
    _min: LessonsMinAggregateOutputType | null
    _max: LessonsMaxAggregateOutputType | null
  }

  type GetLessonsGroupByPayload<T extends lessonsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LessonsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LessonsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LessonsGroupByOutputType[P]>
            : GetScalarType<T[P], LessonsGroupByOutputType[P]>
        }
      >
    >


  export type lessonsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sectionId?: boolean
    order?: boolean
    title?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lesson_progress?: boolean | lessons$lesson_progressArgs<ExtArgs>
    sections?: boolean | sectionsDefaultArgs<ExtArgs>
    _count?: boolean | LessonsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lessons"]>

  export type lessonsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sectionId?: boolean
    order?: boolean
    title?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sections?: boolean | sectionsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lessons"]>

  export type lessonsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sectionId?: boolean
    order?: boolean
    title?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sections?: boolean | sectionsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lessons"]>

  export type lessonsSelectScalar = {
    id?: boolean
    sectionId?: boolean
    order?: boolean
    title?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type lessonsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sectionId" | "order" | "title" | "content" | "createdAt" | "updatedAt", ExtArgs["result"]["lessons"]>
  export type lessonsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lesson_progress?: boolean | lessons$lesson_progressArgs<ExtArgs>
    sections?: boolean | sectionsDefaultArgs<ExtArgs>
    _count?: boolean | LessonsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type lessonsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sections?: boolean | sectionsDefaultArgs<ExtArgs>
  }
  export type lessonsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sections?: boolean | sectionsDefaultArgs<ExtArgs>
  }

  export type $lessonsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "lessons"
    objects: {
      lesson_progress: Prisma.$lesson_progressPayload<ExtArgs>[]
      sections: Prisma.$sectionsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sectionId: string
      order: number
      title: string
      content: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["lessons"]>
    composites: {}
  }

  type lessonsGetPayload<S extends boolean | null | undefined | lessonsDefaultArgs> = $Result.GetResult<Prisma.$lessonsPayload, S>

  type lessonsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<lessonsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: LessonsCountAggregateInputType | true
    }

  export interface lessonsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['lessons'], meta: { name: 'lessons' } }
    /**
     * Find zero or one Lessons that matches the filter.
     * @param {lessonsFindUniqueArgs} args - Arguments to find a Lessons
     * @example
     * // Get one Lessons
     * const lessons = await prisma.lessons.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends lessonsFindUniqueArgs>(args: SelectSubset<T, lessonsFindUniqueArgs<ExtArgs>>): Prisma__lessonsClient<$Result.GetResult<Prisma.$lessonsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Lessons that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {lessonsFindUniqueOrThrowArgs} args - Arguments to find a Lessons
     * @example
     * // Get one Lessons
     * const lessons = await prisma.lessons.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends lessonsFindUniqueOrThrowArgs>(args: SelectSubset<T, lessonsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__lessonsClient<$Result.GetResult<Prisma.$lessonsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lessons that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lessonsFindFirstArgs} args - Arguments to find a Lessons
     * @example
     * // Get one Lessons
     * const lessons = await prisma.lessons.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends lessonsFindFirstArgs>(args?: SelectSubset<T, lessonsFindFirstArgs<ExtArgs>>): Prisma__lessonsClient<$Result.GetResult<Prisma.$lessonsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lessons that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lessonsFindFirstOrThrowArgs} args - Arguments to find a Lessons
     * @example
     * // Get one Lessons
     * const lessons = await prisma.lessons.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends lessonsFindFirstOrThrowArgs>(args?: SelectSubset<T, lessonsFindFirstOrThrowArgs<ExtArgs>>): Prisma__lessonsClient<$Result.GetResult<Prisma.$lessonsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Lessons that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lessonsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lessons
     * const lessons = await prisma.lessons.findMany()
     * 
     * // Get first 10 Lessons
     * const lessons = await prisma.lessons.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lessonsWithIdOnly = await prisma.lessons.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends lessonsFindManyArgs>(args?: SelectSubset<T, lessonsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$lessonsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Lessons.
     * @param {lessonsCreateArgs} args - Arguments to create a Lessons.
     * @example
     * // Create one Lessons
     * const Lessons = await prisma.lessons.create({
     *   data: {
     *     // ... data to create a Lessons
     *   }
     * })
     * 
     */
    create<T extends lessonsCreateArgs>(args: SelectSubset<T, lessonsCreateArgs<ExtArgs>>): Prisma__lessonsClient<$Result.GetResult<Prisma.$lessonsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Lessons.
     * @param {lessonsCreateManyArgs} args - Arguments to create many Lessons.
     * @example
     * // Create many Lessons
     * const lessons = await prisma.lessons.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends lessonsCreateManyArgs>(args?: SelectSubset<T, lessonsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Lessons and returns the data saved in the database.
     * @param {lessonsCreateManyAndReturnArgs} args - Arguments to create many Lessons.
     * @example
     * // Create many Lessons
     * const lessons = await prisma.lessons.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Lessons and only return the `id`
     * const lessonsWithIdOnly = await prisma.lessons.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends lessonsCreateManyAndReturnArgs>(args?: SelectSubset<T, lessonsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$lessonsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Lessons.
     * @param {lessonsDeleteArgs} args - Arguments to delete one Lessons.
     * @example
     * // Delete one Lessons
     * const Lessons = await prisma.lessons.delete({
     *   where: {
     *     // ... filter to delete one Lessons
     *   }
     * })
     * 
     */
    delete<T extends lessonsDeleteArgs>(args: SelectSubset<T, lessonsDeleteArgs<ExtArgs>>): Prisma__lessonsClient<$Result.GetResult<Prisma.$lessonsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Lessons.
     * @param {lessonsUpdateArgs} args - Arguments to update one Lessons.
     * @example
     * // Update one Lessons
     * const lessons = await prisma.lessons.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends lessonsUpdateArgs>(args: SelectSubset<T, lessonsUpdateArgs<ExtArgs>>): Prisma__lessonsClient<$Result.GetResult<Prisma.$lessonsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Lessons.
     * @param {lessonsDeleteManyArgs} args - Arguments to filter Lessons to delete.
     * @example
     * // Delete a few Lessons
     * const { count } = await prisma.lessons.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends lessonsDeleteManyArgs>(args?: SelectSubset<T, lessonsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lessons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lessonsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lessons
     * const lessons = await prisma.lessons.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends lessonsUpdateManyArgs>(args: SelectSubset<T, lessonsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lessons and returns the data updated in the database.
     * @param {lessonsUpdateManyAndReturnArgs} args - Arguments to update many Lessons.
     * @example
     * // Update many Lessons
     * const lessons = await prisma.lessons.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Lessons and only return the `id`
     * const lessonsWithIdOnly = await prisma.lessons.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends lessonsUpdateManyAndReturnArgs>(args: SelectSubset<T, lessonsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$lessonsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Lessons.
     * @param {lessonsUpsertArgs} args - Arguments to update or create a Lessons.
     * @example
     * // Update or create a Lessons
     * const lessons = await prisma.lessons.upsert({
     *   create: {
     *     // ... data to create a Lessons
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lessons we want to update
     *   }
     * })
     */
    upsert<T extends lessonsUpsertArgs>(args: SelectSubset<T, lessonsUpsertArgs<ExtArgs>>): Prisma__lessonsClient<$Result.GetResult<Prisma.$lessonsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Lessons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lessonsCountArgs} args - Arguments to filter Lessons to count.
     * @example
     * // Count the number of Lessons
     * const count = await prisma.lessons.count({
     *   where: {
     *     // ... the filter for the Lessons we want to count
     *   }
     * })
    **/
    count<T extends lessonsCountArgs>(
      args?: Subset<T, lessonsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LessonsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lessons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LessonsAggregateArgs>(args: Subset<T, LessonsAggregateArgs>): Prisma.PrismaPromise<GetLessonsAggregateType<T>>

    /**
     * Group by Lessons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {lessonsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends lessonsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: lessonsGroupByArgs['orderBy'] }
        : { orderBy?: lessonsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, lessonsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLessonsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the lessons model
   */
  readonly fields: lessonsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for lessons.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__lessonsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lesson_progress<T extends lessons$lesson_progressArgs<ExtArgs> = {}>(args?: Subset<T, lessons$lesson_progressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$lesson_progressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sections<T extends sectionsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, sectionsDefaultArgs<ExtArgs>>): Prisma__sectionsClient<$Result.GetResult<Prisma.$sectionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the lessons model
   */
  interface lessonsFieldRefs {
    readonly id: FieldRef<"lessons", 'String'>
    readonly sectionId: FieldRef<"lessons", 'String'>
    readonly order: FieldRef<"lessons", 'Int'>
    readonly title: FieldRef<"lessons", 'String'>
    readonly content: FieldRef<"lessons", 'Json'>
    readonly createdAt: FieldRef<"lessons", 'DateTime'>
    readonly updatedAt: FieldRef<"lessons", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * lessons findUnique
   */
  export type lessonsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lessons
     */
    select?: lessonsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lessons
     */
    omit?: lessonsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonsInclude<ExtArgs> | null
    /**
     * Filter, which lessons to fetch.
     */
    where: lessonsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lessons findUniqueOrThrow
   */
  export type lessonsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lessons
     */
    select?: lessonsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lessons
     */
    omit?: lessonsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonsInclude<ExtArgs> | null
    /**
     * Filter, which lessons to fetch.
     */
    where: lessonsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lessons findFirst
   */
  export type lessonsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lessons
     */
    select?: lessonsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lessons
     */
    omit?: lessonsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonsInclude<ExtArgs> | null
    /**
     * Filter, which lessons to fetch.
     */
    where?: lessonsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lessons to fetch.
     */
    orderBy?: lessonsOrderByWithRelationInput | lessonsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for lessons.
     */
    cursor?: lessonsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of lessons.
     */
    distinct?: LessonsScalarFieldEnum | LessonsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lessons findFirstOrThrow
   */
  export type lessonsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lessons
     */
    select?: lessonsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lessons
     */
    omit?: lessonsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonsInclude<ExtArgs> | null
    /**
     * Filter, which lessons to fetch.
     */
    where?: lessonsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lessons to fetch.
     */
    orderBy?: lessonsOrderByWithRelationInput | lessonsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for lessons.
     */
    cursor?: lessonsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of lessons.
     */
    distinct?: LessonsScalarFieldEnum | LessonsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lessons findMany
   */
  export type lessonsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lessons
     */
    select?: lessonsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lessons
     */
    omit?: lessonsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonsInclude<ExtArgs> | null
    /**
     * Filter, which lessons to fetch.
     */
    where?: lessonsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of lessons to fetch.
     */
    orderBy?: lessonsOrderByWithRelationInput | lessonsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing lessons.
     */
    cursor?: lessonsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` lessons.
     */
    skip?: number
    distinct?: LessonsScalarFieldEnum | LessonsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lessons create
   */
  export type lessonsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lessons
     */
    select?: lessonsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lessons
     */
    omit?: lessonsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonsInclude<ExtArgs> | null
    /**
     * The data needed to create a lessons.
     */
    data: XOR<lessonsCreateInput, lessonsUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lessons createMany
   */
  export type lessonsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many lessons.
     */
    data: lessonsCreateManyInput | lessonsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * lessons createManyAndReturn
   */
  export type lessonsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lessons
     */
    select?: lessonsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the lessons
     */
    omit?: lessonsOmit<ExtArgs> | null
    /**
     * The data used to create many lessons.
     */
    data: lessonsCreateManyInput | lessonsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * lessons update
   */
  export type lessonsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lessons
     */
    select?: lessonsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lessons
     */
    omit?: lessonsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonsInclude<ExtArgs> | null
    /**
     * The data needed to update a lessons.
     */
    data: XOR<lessonsUpdateInput, lessonsUncheckedUpdateInput>
    /**
     * Choose, which lessons to update.
     */
    where: lessonsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lessons updateMany
   */
  export type lessonsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update lessons.
     */
    data: XOR<lessonsUpdateManyMutationInput, lessonsUncheckedUpdateManyInput>
    /**
     * Filter which lessons to update
     */
    where?: lessonsWhereInput
    /**
     * Limit how many lessons to update.
     */
    limit?: number
  }

  /**
   * lessons updateManyAndReturn
   */
  export type lessonsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lessons
     */
    select?: lessonsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the lessons
     */
    omit?: lessonsOmit<ExtArgs> | null
    /**
     * The data used to update lessons.
     */
    data: XOR<lessonsUpdateManyMutationInput, lessonsUncheckedUpdateManyInput>
    /**
     * Filter which lessons to update
     */
    where?: lessonsWhereInput
    /**
     * Limit how many lessons to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * lessons upsert
   */
  export type lessonsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lessons
     */
    select?: lessonsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lessons
     */
    omit?: lessonsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonsInclude<ExtArgs> | null
    /**
     * The filter to search for the lessons to update in case it exists.
     */
    where: lessonsWhereUniqueInput
    /**
     * In case the lessons found by the `where` argument doesn't exist, create a new lessons with this data.
     */
    create: XOR<lessonsCreateInput, lessonsUncheckedCreateInput>
    /**
     * In case the lessons was found with the provided `where` argument, update it with this data.
     */
    update: XOR<lessonsUpdateInput, lessonsUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lessons delete
   */
  export type lessonsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lessons
     */
    select?: lessonsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lessons
     */
    omit?: lessonsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonsInclude<ExtArgs> | null
    /**
     * Filter which lessons to delete.
     */
    where: lessonsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * lessons deleteMany
   */
  export type lessonsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which lessons to delete
     */
    where?: lessonsWhereInput
    /**
     * Limit how many lessons to delete.
     */
    limit?: number
  }

  /**
   * lessons.lesson_progress
   */
  export type lessons$lesson_progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lesson_progress
     */
    select?: lesson_progressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lesson_progress
     */
    omit?: lesson_progressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lesson_progressInclude<ExtArgs> | null
    where?: lesson_progressWhereInput
    orderBy?: lesson_progressOrderByWithRelationInput | lesson_progressOrderByWithRelationInput[]
    cursor?: lesson_progressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Lesson_progressScalarFieldEnum | Lesson_progressScalarFieldEnum[]
  }

  /**
   * lessons without action
   */
  export type lessonsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lessons
     */
    select?: lessonsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lessons
     */
    omit?: lessonsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonsInclude<ExtArgs> | null
  }


  /**
   * Model sections
   */

  export type AggregateSections = {
    _count: SectionsCountAggregateOutputType | null
    _avg: SectionsAvgAggregateOutputType | null
    _sum: SectionsSumAggregateOutputType | null
    _min: SectionsMinAggregateOutputType | null
    _max: SectionsMaxAggregateOutputType | null
  }

  export type SectionsAvgAggregateOutputType = {
    order: number | null
  }

  export type SectionsSumAggregateOutputType = {
    order: number | null
  }

  export type SectionsMinAggregateOutputType = {
    id: string | null
    courseId: string | null
    order: number | null
    title: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SectionsMaxAggregateOutputType = {
    id: string | null
    courseId: string | null
    order: number | null
    title: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SectionsCountAggregateOutputType = {
    id: number
    courseId: number
    order: number
    title: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SectionsAvgAggregateInputType = {
    order?: true
  }

  export type SectionsSumAggregateInputType = {
    order?: true
  }

  export type SectionsMinAggregateInputType = {
    id?: true
    courseId?: true
    order?: true
    title?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SectionsMaxAggregateInputType = {
    id?: true
    courseId?: true
    order?: true
    title?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SectionsCountAggregateInputType = {
    id?: true
    courseId?: true
    order?: true
    title?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SectionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sections to aggregate.
     */
    where?: sectionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sections to fetch.
     */
    orderBy?: sectionsOrderByWithRelationInput | sectionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: sectionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned sections
    **/
    _count?: true | SectionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SectionsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SectionsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SectionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SectionsMaxAggregateInputType
  }

  export type GetSectionsAggregateType<T extends SectionsAggregateArgs> = {
        [P in keyof T & keyof AggregateSections]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSections[P]>
      : GetScalarType<T[P], AggregateSections[P]>
  }




  export type sectionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: sectionsWhereInput
    orderBy?: sectionsOrderByWithAggregationInput | sectionsOrderByWithAggregationInput[]
    by: SectionsScalarFieldEnum[] | SectionsScalarFieldEnum
    having?: sectionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SectionsCountAggregateInputType | true
    _avg?: SectionsAvgAggregateInputType
    _sum?: SectionsSumAggregateInputType
    _min?: SectionsMinAggregateInputType
    _max?: SectionsMaxAggregateInputType
  }

  export type SectionsGroupByOutputType = {
    id: string
    courseId: string
    order: number
    title: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: SectionsCountAggregateOutputType | null
    _avg: SectionsAvgAggregateOutputType | null
    _sum: SectionsSumAggregateOutputType | null
    _min: SectionsMinAggregateOutputType | null
    _max: SectionsMaxAggregateOutputType | null
  }

  type GetSectionsGroupByPayload<T extends sectionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SectionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SectionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SectionsGroupByOutputType[P]>
            : GetScalarType<T[P], SectionsGroupByOutputType[P]>
        }
      >
    >


  export type sectionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    courseId?: boolean
    order?: boolean
    title?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lessons?: boolean | sections$lessonsArgs<ExtArgs>
    courses?: boolean | coursesDefaultArgs<ExtArgs>
    assessment_questions?: boolean | sections$assessment_questionsArgs<ExtArgs>
    user_assessments?: boolean | sections$user_assessmentsArgs<ExtArgs>
    _count?: boolean | SectionsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sections"]>

  export type sectionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    courseId?: boolean
    order?: boolean
    title?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    courses?: boolean | coursesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sections"]>

  export type sectionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    courseId?: boolean
    order?: boolean
    title?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    courses?: boolean | coursesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sections"]>

  export type sectionsSelectScalar = {
    id?: boolean
    courseId?: boolean
    order?: boolean
    title?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type sectionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "courseId" | "order" | "title" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["sections"]>
  export type sectionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lessons?: boolean | sections$lessonsArgs<ExtArgs>
    courses?: boolean | coursesDefaultArgs<ExtArgs>
    assessment_questions?: boolean | sections$assessment_questionsArgs<ExtArgs>
    user_assessments?: boolean | sections$user_assessmentsArgs<ExtArgs>
    _count?: boolean | SectionsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type sectionsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courses?: boolean | coursesDefaultArgs<ExtArgs>
  }
  export type sectionsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courses?: boolean | coursesDefaultArgs<ExtArgs>
  }

  export type $sectionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "sections"
    objects: {
      lessons: Prisma.$lessonsPayload<ExtArgs>[]
      courses: Prisma.$coursesPayload<ExtArgs>
      assessment_questions: Prisma.$assessment_questionsPayload<ExtArgs>[]
      user_assessments: Prisma.$user_assessmentsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      courseId: string
      order: number
      title: string
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["sections"]>
    composites: {}
  }

  type sectionsGetPayload<S extends boolean | null | undefined | sectionsDefaultArgs> = $Result.GetResult<Prisma.$sectionsPayload, S>

  type sectionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<sectionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: SectionsCountAggregateInputType | true
    }

  export interface sectionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['sections'], meta: { name: 'sections' } }
    /**
     * Find zero or one Sections that matches the filter.
     * @param {sectionsFindUniqueArgs} args - Arguments to find a Sections
     * @example
     * // Get one Sections
     * const sections = await prisma.sections.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends sectionsFindUniqueArgs>(args: SelectSubset<T, sectionsFindUniqueArgs<ExtArgs>>): Prisma__sectionsClient<$Result.GetResult<Prisma.$sectionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Sections that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {sectionsFindUniqueOrThrowArgs} args - Arguments to find a Sections
     * @example
     * // Get one Sections
     * const sections = await prisma.sections.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends sectionsFindUniqueOrThrowArgs>(args: SelectSubset<T, sectionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__sectionsClient<$Result.GetResult<Prisma.$sectionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sectionsFindFirstArgs} args - Arguments to find a Sections
     * @example
     * // Get one Sections
     * const sections = await prisma.sections.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends sectionsFindFirstArgs>(args?: SelectSubset<T, sectionsFindFirstArgs<ExtArgs>>): Prisma__sectionsClient<$Result.GetResult<Prisma.$sectionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sections that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sectionsFindFirstOrThrowArgs} args - Arguments to find a Sections
     * @example
     * // Get one Sections
     * const sections = await prisma.sections.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends sectionsFindFirstOrThrowArgs>(args?: SelectSubset<T, sectionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__sectionsClient<$Result.GetResult<Prisma.$sectionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sectionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sections
     * const sections = await prisma.sections.findMany()
     * 
     * // Get first 10 Sections
     * const sections = await prisma.sections.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sectionsWithIdOnly = await prisma.sections.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends sectionsFindManyArgs>(args?: SelectSubset<T, sectionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sectionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Sections.
     * @param {sectionsCreateArgs} args - Arguments to create a Sections.
     * @example
     * // Create one Sections
     * const Sections = await prisma.sections.create({
     *   data: {
     *     // ... data to create a Sections
     *   }
     * })
     * 
     */
    create<T extends sectionsCreateArgs>(args: SelectSubset<T, sectionsCreateArgs<ExtArgs>>): Prisma__sectionsClient<$Result.GetResult<Prisma.$sectionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sections.
     * @param {sectionsCreateManyArgs} args - Arguments to create many Sections.
     * @example
     * // Create many Sections
     * const sections = await prisma.sections.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends sectionsCreateManyArgs>(args?: SelectSubset<T, sectionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sections and returns the data saved in the database.
     * @param {sectionsCreateManyAndReturnArgs} args - Arguments to create many Sections.
     * @example
     * // Create many Sections
     * const sections = await prisma.sections.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sections and only return the `id`
     * const sectionsWithIdOnly = await prisma.sections.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends sectionsCreateManyAndReturnArgs>(args?: SelectSubset<T, sectionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sectionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Sections.
     * @param {sectionsDeleteArgs} args - Arguments to delete one Sections.
     * @example
     * // Delete one Sections
     * const Sections = await prisma.sections.delete({
     *   where: {
     *     // ... filter to delete one Sections
     *   }
     * })
     * 
     */
    delete<T extends sectionsDeleteArgs>(args: SelectSubset<T, sectionsDeleteArgs<ExtArgs>>): Prisma__sectionsClient<$Result.GetResult<Prisma.$sectionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Sections.
     * @param {sectionsUpdateArgs} args - Arguments to update one Sections.
     * @example
     * // Update one Sections
     * const sections = await prisma.sections.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends sectionsUpdateArgs>(args: SelectSubset<T, sectionsUpdateArgs<ExtArgs>>): Prisma__sectionsClient<$Result.GetResult<Prisma.$sectionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sections.
     * @param {sectionsDeleteManyArgs} args - Arguments to filter Sections to delete.
     * @example
     * // Delete a few Sections
     * const { count } = await prisma.sections.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends sectionsDeleteManyArgs>(args?: SelectSubset<T, sectionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sectionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sections
     * const sections = await prisma.sections.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends sectionsUpdateManyArgs>(args: SelectSubset<T, sectionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sections and returns the data updated in the database.
     * @param {sectionsUpdateManyAndReturnArgs} args - Arguments to update many Sections.
     * @example
     * // Update many Sections
     * const sections = await prisma.sections.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sections and only return the `id`
     * const sectionsWithIdOnly = await prisma.sections.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends sectionsUpdateManyAndReturnArgs>(args: SelectSubset<T, sectionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sectionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Sections.
     * @param {sectionsUpsertArgs} args - Arguments to update or create a Sections.
     * @example
     * // Update or create a Sections
     * const sections = await prisma.sections.upsert({
     *   create: {
     *     // ... data to create a Sections
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sections we want to update
     *   }
     * })
     */
    upsert<T extends sectionsUpsertArgs>(args: SelectSubset<T, sectionsUpsertArgs<ExtArgs>>): Prisma__sectionsClient<$Result.GetResult<Prisma.$sectionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sectionsCountArgs} args - Arguments to filter Sections to count.
     * @example
     * // Count the number of Sections
     * const count = await prisma.sections.count({
     *   where: {
     *     // ... the filter for the Sections we want to count
     *   }
     * })
    **/
    count<T extends sectionsCountArgs>(
      args?: Subset<T, sectionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SectionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SectionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SectionsAggregateArgs>(args: Subset<T, SectionsAggregateArgs>): Prisma.PrismaPromise<GetSectionsAggregateType<T>>

    /**
     * Group by Sections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sectionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends sectionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: sectionsGroupByArgs['orderBy'] }
        : { orderBy?: sectionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, sectionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSectionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the sections model
   */
  readonly fields: sectionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for sections.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__sectionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lessons<T extends sections$lessonsArgs<ExtArgs> = {}>(args?: Subset<T, sections$lessonsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$lessonsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    courses<T extends coursesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, coursesDefaultArgs<ExtArgs>>): Prisma__coursesClient<$Result.GetResult<Prisma.$coursesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    assessment_questions<T extends sections$assessment_questionsArgs<ExtArgs> = {}>(args?: Subset<T, sections$assessment_questionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$assessment_questionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user_assessments<T extends sections$user_assessmentsArgs<ExtArgs> = {}>(args?: Subset<T, sections$user_assessmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_assessmentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the sections model
   */
  interface sectionsFieldRefs {
    readonly id: FieldRef<"sections", 'String'>
    readonly courseId: FieldRef<"sections", 'String'>
    readonly order: FieldRef<"sections", 'Int'>
    readonly title: FieldRef<"sections", 'String'>
    readonly description: FieldRef<"sections", 'String'>
    readonly createdAt: FieldRef<"sections", 'DateTime'>
    readonly updatedAt: FieldRef<"sections", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * sections findUnique
   */
  export type sectionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sections
     */
    select?: sectionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sections
     */
    omit?: sectionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sectionsInclude<ExtArgs> | null
    /**
     * Filter, which sections to fetch.
     */
    where: sectionsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * sections findUniqueOrThrow
   */
  export type sectionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sections
     */
    select?: sectionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sections
     */
    omit?: sectionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sectionsInclude<ExtArgs> | null
    /**
     * Filter, which sections to fetch.
     */
    where: sectionsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * sections findFirst
   */
  export type sectionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sections
     */
    select?: sectionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sections
     */
    omit?: sectionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sectionsInclude<ExtArgs> | null
    /**
     * Filter, which sections to fetch.
     */
    where?: sectionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sections to fetch.
     */
    orderBy?: sectionsOrderByWithRelationInput | sectionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sections.
     */
    cursor?: sectionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sections.
     */
    distinct?: SectionsScalarFieldEnum | SectionsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * sections findFirstOrThrow
   */
  export type sectionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sections
     */
    select?: sectionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sections
     */
    omit?: sectionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sectionsInclude<ExtArgs> | null
    /**
     * Filter, which sections to fetch.
     */
    where?: sectionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sections to fetch.
     */
    orderBy?: sectionsOrderByWithRelationInput | sectionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sections.
     */
    cursor?: sectionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sections.
     */
    distinct?: SectionsScalarFieldEnum | SectionsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * sections findMany
   */
  export type sectionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sections
     */
    select?: sectionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sections
     */
    omit?: sectionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sectionsInclude<ExtArgs> | null
    /**
     * Filter, which sections to fetch.
     */
    where?: sectionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sections to fetch.
     */
    orderBy?: sectionsOrderByWithRelationInput | sectionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing sections.
     */
    cursor?: sectionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sections.
     */
    skip?: number
    distinct?: SectionsScalarFieldEnum | SectionsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * sections create
   */
  export type sectionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sections
     */
    select?: sectionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sections
     */
    omit?: sectionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sectionsInclude<ExtArgs> | null
    /**
     * The data needed to create a sections.
     */
    data: XOR<sectionsCreateInput, sectionsUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * sections createMany
   */
  export type sectionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many sections.
     */
    data: sectionsCreateManyInput | sectionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * sections createManyAndReturn
   */
  export type sectionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sections
     */
    select?: sectionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the sections
     */
    omit?: sectionsOmit<ExtArgs> | null
    /**
     * The data used to create many sections.
     */
    data: sectionsCreateManyInput | sectionsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sectionsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * sections update
   */
  export type sectionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sections
     */
    select?: sectionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sections
     */
    omit?: sectionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sectionsInclude<ExtArgs> | null
    /**
     * The data needed to update a sections.
     */
    data: XOR<sectionsUpdateInput, sectionsUncheckedUpdateInput>
    /**
     * Choose, which sections to update.
     */
    where: sectionsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * sections updateMany
   */
  export type sectionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update sections.
     */
    data: XOR<sectionsUpdateManyMutationInput, sectionsUncheckedUpdateManyInput>
    /**
     * Filter which sections to update
     */
    where?: sectionsWhereInput
    /**
     * Limit how many sections to update.
     */
    limit?: number
  }

  /**
   * sections updateManyAndReturn
   */
  export type sectionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sections
     */
    select?: sectionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the sections
     */
    omit?: sectionsOmit<ExtArgs> | null
    /**
     * The data used to update sections.
     */
    data: XOR<sectionsUpdateManyMutationInput, sectionsUncheckedUpdateManyInput>
    /**
     * Filter which sections to update
     */
    where?: sectionsWhereInput
    /**
     * Limit how many sections to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sectionsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * sections upsert
   */
  export type sectionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sections
     */
    select?: sectionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sections
     */
    omit?: sectionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sectionsInclude<ExtArgs> | null
    /**
     * The filter to search for the sections to update in case it exists.
     */
    where: sectionsWhereUniqueInput
    /**
     * In case the sections found by the `where` argument doesn't exist, create a new sections with this data.
     */
    create: XOR<sectionsCreateInput, sectionsUncheckedCreateInput>
    /**
     * In case the sections was found with the provided `where` argument, update it with this data.
     */
    update: XOR<sectionsUpdateInput, sectionsUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * sections delete
   */
  export type sectionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sections
     */
    select?: sectionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sections
     */
    omit?: sectionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sectionsInclude<ExtArgs> | null
    /**
     * Filter which sections to delete.
     */
    where: sectionsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * sections deleteMany
   */
  export type sectionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sections to delete
     */
    where?: sectionsWhereInput
    /**
     * Limit how many sections to delete.
     */
    limit?: number
  }

  /**
   * sections.lessons
   */
  export type sections$lessonsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the lessons
     */
    select?: lessonsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the lessons
     */
    omit?: lessonsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: lessonsInclude<ExtArgs> | null
    where?: lessonsWhereInput
    orderBy?: lessonsOrderByWithRelationInput | lessonsOrderByWithRelationInput[]
    cursor?: lessonsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LessonsScalarFieldEnum | LessonsScalarFieldEnum[]
  }

  /**
   * sections.assessment_questions
   */
  export type sections$assessment_questionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the assessment_questions
     */
    select?: assessment_questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the assessment_questions
     */
    omit?: assessment_questionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: assessment_questionsInclude<ExtArgs> | null
    where?: assessment_questionsWhereInput
    orderBy?: assessment_questionsOrderByWithRelationInput | assessment_questionsOrderByWithRelationInput[]
    cursor?: assessment_questionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Assessment_questionsScalarFieldEnum | Assessment_questionsScalarFieldEnum[]
  }

  /**
   * sections.user_assessments
   */
  export type sections$user_assessmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_assessments
     */
    select?: user_assessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_assessments
     */
    omit?: user_assessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_assessmentsInclude<ExtArgs> | null
    where?: user_assessmentsWhereInput
    orderBy?: user_assessmentsOrderByWithRelationInput | user_assessmentsOrderByWithRelationInput[]
    cursor?: user_assessmentsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: User_assessmentsScalarFieldEnum | User_assessmentsScalarFieldEnum[]
  }

  /**
   * sections without action
   */
  export type sectionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sections
     */
    select?: sectionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sections
     */
    omit?: sectionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sectionsInclude<ExtArgs> | null
  }


  /**
   * Model creator_profiles
   */

  export type AggregateCreator_profiles = {
    _count: Creator_profilesCountAggregateOutputType | null
    _min: Creator_profilesMinAggregateOutputType | null
    _max: Creator_profilesMaxAggregateOutputType | null
  }

  export type Creator_profilesMinAggregateOutputType = {
    userId: string | null
    name: string | null
    title: string | null
    bio: string | null
    experience: string | null
    avatarUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Creator_profilesMaxAggregateOutputType = {
    userId: string | null
    name: string | null
    title: string | null
    bio: string | null
    experience: string | null
    avatarUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Creator_profilesCountAggregateOutputType = {
    userId: number
    name: number
    title: number
    bio: number
    experience: number
    avatarUrl: number
    socialLinks: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type Creator_profilesMinAggregateInputType = {
    userId?: true
    name?: true
    title?: true
    bio?: true
    experience?: true
    avatarUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Creator_profilesMaxAggregateInputType = {
    userId?: true
    name?: true
    title?: true
    bio?: true
    experience?: true
    avatarUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Creator_profilesCountAggregateInputType = {
    userId?: true
    name?: true
    title?: true
    bio?: true
    experience?: true
    avatarUrl?: true
    socialLinks?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type Creator_profilesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which creator_profiles to aggregate.
     */
    where?: creator_profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of creator_profiles to fetch.
     */
    orderBy?: creator_profilesOrderByWithRelationInput | creator_profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: creator_profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` creator_profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` creator_profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned creator_profiles
    **/
    _count?: true | Creator_profilesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Creator_profilesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Creator_profilesMaxAggregateInputType
  }

  export type GetCreator_profilesAggregateType<T extends Creator_profilesAggregateArgs> = {
        [P in keyof T & keyof AggregateCreator_profiles]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCreator_profiles[P]>
      : GetScalarType<T[P], AggregateCreator_profiles[P]>
  }




  export type creator_profilesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: creator_profilesWhereInput
    orderBy?: creator_profilesOrderByWithAggregationInput | creator_profilesOrderByWithAggregationInput[]
    by: Creator_profilesScalarFieldEnum[] | Creator_profilesScalarFieldEnum
    having?: creator_profilesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Creator_profilesCountAggregateInputType | true
    _min?: Creator_profilesMinAggregateInputType
    _max?: Creator_profilesMaxAggregateInputType
  }

  export type Creator_profilesGroupByOutputType = {
    userId: string
    name: string | null
    title: string | null
    bio: string | null
    experience: string | null
    avatarUrl: string | null
    socialLinks: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: Creator_profilesCountAggregateOutputType | null
    _min: Creator_profilesMinAggregateOutputType | null
    _max: Creator_profilesMaxAggregateOutputType | null
  }

  type GetCreator_profilesGroupByPayload<T extends creator_profilesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Creator_profilesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Creator_profilesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Creator_profilesGroupByOutputType[P]>
            : GetScalarType<T[P], Creator_profilesGroupByOutputType[P]>
        }
      >
    >


  export type creator_profilesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    name?: boolean
    title?: boolean
    bio?: boolean
    experience?: boolean
    avatarUrl?: boolean
    socialLinks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["creator_profiles"]>

  export type creator_profilesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    name?: boolean
    title?: boolean
    bio?: boolean
    experience?: boolean
    avatarUrl?: boolean
    socialLinks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["creator_profiles"]>

  export type creator_profilesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    name?: boolean
    title?: boolean
    bio?: boolean
    experience?: boolean
    avatarUrl?: boolean
    socialLinks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["creator_profiles"]>

  export type creator_profilesSelectScalar = {
    userId?: boolean
    name?: boolean
    title?: boolean
    bio?: boolean
    experience?: boolean
    avatarUrl?: boolean
    socialLinks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type creator_profilesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"userId" | "name" | "title" | "bio" | "experience" | "avatarUrl" | "socialLinks" | "createdAt" | "updatedAt", ExtArgs["result"]["creator_profiles"]>

  export type $creator_profilesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "creator_profiles"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      userId: string
      name: string | null
      title: string | null
      bio: string | null
      experience: string | null
      avatarUrl: string | null
      socialLinks: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["creator_profiles"]>
    composites: {}
  }

  type creator_profilesGetPayload<S extends boolean | null | undefined | creator_profilesDefaultArgs> = $Result.GetResult<Prisma.$creator_profilesPayload, S>

  type creator_profilesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<creator_profilesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: Creator_profilesCountAggregateInputType | true
    }

  export interface creator_profilesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['creator_profiles'], meta: { name: 'creator_profiles' } }
    /**
     * Find zero or one Creator_profiles that matches the filter.
     * @param {creator_profilesFindUniqueArgs} args - Arguments to find a Creator_profiles
     * @example
     * // Get one Creator_profiles
     * const creator_profiles = await prisma.creator_profiles.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends creator_profilesFindUniqueArgs>(args: SelectSubset<T, creator_profilesFindUniqueArgs<ExtArgs>>): Prisma__creator_profilesClient<$Result.GetResult<Prisma.$creator_profilesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Creator_profiles that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {creator_profilesFindUniqueOrThrowArgs} args - Arguments to find a Creator_profiles
     * @example
     * // Get one Creator_profiles
     * const creator_profiles = await prisma.creator_profiles.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends creator_profilesFindUniqueOrThrowArgs>(args: SelectSubset<T, creator_profilesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__creator_profilesClient<$Result.GetResult<Prisma.$creator_profilesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Creator_profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {creator_profilesFindFirstArgs} args - Arguments to find a Creator_profiles
     * @example
     * // Get one Creator_profiles
     * const creator_profiles = await prisma.creator_profiles.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends creator_profilesFindFirstArgs>(args?: SelectSubset<T, creator_profilesFindFirstArgs<ExtArgs>>): Prisma__creator_profilesClient<$Result.GetResult<Prisma.$creator_profilesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Creator_profiles that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {creator_profilesFindFirstOrThrowArgs} args - Arguments to find a Creator_profiles
     * @example
     * // Get one Creator_profiles
     * const creator_profiles = await prisma.creator_profiles.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends creator_profilesFindFirstOrThrowArgs>(args?: SelectSubset<T, creator_profilesFindFirstOrThrowArgs<ExtArgs>>): Prisma__creator_profilesClient<$Result.GetResult<Prisma.$creator_profilesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Creator_profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {creator_profilesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Creator_profiles
     * const creator_profiles = await prisma.creator_profiles.findMany()
     * 
     * // Get first 10 Creator_profiles
     * const creator_profiles = await prisma.creator_profiles.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const creator_profilesWithUserIdOnly = await prisma.creator_profiles.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends creator_profilesFindManyArgs>(args?: SelectSubset<T, creator_profilesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$creator_profilesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Creator_profiles.
     * @param {creator_profilesCreateArgs} args - Arguments to create a Creator_profiles.
     * @example
     * // Create one Creator_profiles
     * const Creator_profiles = await prisma.creator_profiles.create({
     *   data: {
     *     // ... data to create a Creator_profiles
     *   }
     * })
     * 
     */
    create<T extends creator_profilesCreateArgs>(args: SelectSubset<T, creator_profilesCreateArgs<ExtArgs>>): Prisma__creator_profilesClient<$Result.GetResult<Prisma.$creator_profilesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Creator_profiles.
     * @param {creator_profilesCreateManyArgs} args - Arguments to create many Creator_profiles.
     * @example
     * // Create many Creator_profiles
     * const creator_profiles = await prisma.creator_profiles.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends creator_profilesCreateManyArgs>(args?: SelectSubset<T, creator_profilesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Creator_profiles and returns the data saved in the database.
     * @param {creator_profilesCreateManyAndReturnArgs} args - Arguments to create many Creator_profiles.
     * @example
     * // Create many Creator_profiles
     * const creator_profiles = await prisma.creator_profiles.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Creator_profiles and only return the `userId`
     * const creator_profilesWithUserIdOnly = await prisma.creator_profiles.createManyAndReturn({
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends creator_profilesCreateManyAndReturnArgs>(args?: SelectSubset<T, creator_profilesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$creator_profilesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Creator_profiles.
     * @param {creator_profilesDeleteArgs} args - Arguments to delete one Creator_profiles.
     * @example
     * // Delete one Creator_profiles
     * const Creator_profiles = await prisma.creator_profiles.delete({
     *   where: {
     *     // ... filter to delete one Creator_profiles
     *   }
     * })
     * 
     */
    delete<T extends creator_profilesDeleteArgs>(args: SelectSubset<T, creator_profilesDeleteArgs<ExtArgs>>): Prisma__creator_profilesClient<$Result.GetResult<Prisma.$creator_profilesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Creator_profiles.
     * @param {creator_profilesUpdateArgs} args - Arguments to update one Creator_profiles.
     * @example
     * // Update one Creator_profiles
     * const creator_profiles = await prisma.creator_profiles.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends creator_profilesUpdateArgs>(args: SelectSubset<T, creator_profilesUpdateArgs<ExtArgs>>): Prisma__creator_profilesClient<$Result.GetResult<Prisma.$creator_profilesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Creator_profiles.
     * @param {creator_profilesDeleteManyArgs} args - Arguments to filter Creator_profiles to delete.
     * @example
     * // Delete a few Creator_profiles
     * const { count } = await prisma.creator_profiles.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends creator_profilesDeleteManyArgs>(args?: SelectSubset<T, creator_profilesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Creator_profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {creator_profilesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Creator_profiles
     * const creator_profiles = await prisma.creator_profiles.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends creator_profilesUpdateManyArgs>(args: SelectSubset<T, creator_profilesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Creator_profiles and returns the data updated in the database.
     * @param {creator_profilesUpdateManyAndReturnArgs} args - Arguments to update many Creator_profiles.
     * @example
     * // Update many Creator_profiles
     * const creator_profiles = await prisma.creator_profiles.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Creator_profiles and only return the `userId`
     * const creator_profilesWithUserIdOnly = await prisma.creator_profiles.updateManyAndReturn({
     *   select: { userId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends creator_profilesUpdateManyAndReturnArgs>(args: SelectSubset<T, creator_profilesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$creator_profilesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Creator_profiles.
     * @param {creator_profilesUpsertArgs} args - Arguments to update or create a Creator_profiles.
     * @example
     * // Update or create a Creator_profiles
     * const creator_profiles = await prisma.creator_profiles.upsert({
     *   create: {
     *     // ... data to create a Creator_profiles
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Creator_profiles we want to update
     *   }
     * })
     */
    upsert<T extends creator_profilesUpsertArgs>(args: SelectSubset<T, creator_profilesUpsertArgs<ExtArgs>>): Prisma__creator_profilesClient<$Result.GetResult<Prisma.$creator_profilesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Creator_profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {creator_profilesCountArgs} args - Arguments to filter Creator_profiles to count.
     * @example
     * // Count the number of Creator_profiles
     * const count = await prisma.creator_profiles.count({
     *   where: {
     *     // ... the filter for the Creator_profiles we want to count
     *   }
     * })
    **/
    count<T extends creator_profilesCountArgs>(
      args?: Subset<T, creator_profilesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Creator_profilesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Creator_profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Creator_profilesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Creator_profilesAggregateArgs>(args: Subset<T, Creator_profilesAggregateArgs>): Prisma.PrismaPromise<GetCreator_profilesAggregateType<T>>

    /**
     * Group by Creator_profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {creator_profilesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends creator_profilesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: creator_profilesGroupByArgs['orderBy'] }
        : { orderBy?: creator_profilesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, creator_profilesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCreator_profilesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the creator_profiles model
   */
  readonly fields: creator_profilesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for creator_profiles.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__creator_profilesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the creator_profiles model
   */
  interface creator_profilesFieldRefs {
    readonly userId: FieldRef<"creator_profiles", 'String'>
    readonly name: FieldRef<"creator_profiles", 'String'>
    readonly title: FieldRef<"creator_profiles", 'String'>
    readonly bio: FieldRef<"creator_profiles", 'String'>
    readonly experience: FieldRef<"creator_profiles", 'String'>
    readonly avatarUrl: FieldRef<"creator_profiles", 'String'>
    readonly socialLinks: FieldRef<"creator_profiles", 'Json'>
    readonly createdAt: FieldRef<"creator_profiles", 'DateTime'>
    readonly updatedAt: FieldRef<"creator_profiles", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * creator_profiles findUnique
   */
  export type creator_profilesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the creator_profiles
     */
    select?: creator_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the creator_profiles
     */
    omit?: creator_profilesOmit<ExtArgs> | null
    /**
     * Filter, which creator_profiles to fetch.
     */
    where: creator_profilesWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * creator_profiles findUniqueOrThrow
   */
  export type creator_profilesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the creator_profiles
     */
    select?: creator_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the creator_profiles
     */
    omit?: creator_profilesOmit<ExtArgs> | null
    /**
     * Filter, which creator_profiles to fetch.
     */
    where: creator_profilesWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * creator_profiles findFirst
   */
  export type creator_profilesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the creator_profiles
     */
    select?: creator_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the creator_profiles
     */
    omit?: creator_profilesOmit<ExtArgs> | null
    /**
     * Filter, which creator_profiles to fetch.
     */
    where?: creator_profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of creator_profiles to fetch.
     */
    orderBy?: creator_profilesOrderByWithRelationInput | creator_profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for creator_profiles.
     */
    cursor?: creator_profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` creator_profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` creator_profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of creator_profiles.
     */
    distinct?: Creator_profilesScalarFieldEnum | Creator_profilesScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * creator_profiles findFirstOrThrow
   */
  export type creator_profilesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the creator_profiles
     */
    select?: creator_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the creator_profiles
     */
    omit?: creator_profilesOmit<ExtArgs> | null
    /**
     * Filter, which creator_profiles to fetch.
     */
    where?: creator_profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of creator_profiles to fetch.
     */
    orderBy?: creator_profilesOrderByWithRelationInput | creator_profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for creator_profiles.
     */
    cursor?: creator_profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` creator_profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` creator_profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of creator_profiles.
     */
    distinct?: Creator_profilesScalarFieldEnum | Creator_profilesScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * creator_profiles findMany
   */
  export type creator_profilesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the creator_profiles
     */
    select?: creator_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the creator_profiles
     */
    omit?: creator_profilesOmit<ExtArgs> | null
    /**
     * Filter, which creator_profiles to fetch.
     */
    where?: creator_profilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of creator_profiles to fetch.
     */
    orderBy?: creator_profilesOrderByWithRelationInput | creator_profilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing creator_profiles.
     */
    cursor?: creator_profilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` creator_profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` creator_profiles.
     */
    skip?: number
    distinct?: Creator_profilesScalarFieldEnum | Creator_profilesScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * creator_profiles create
   */
  export type creator_profilesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the creator_profiles
     */
    select?: creator_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the creator_profiles
     */
    omit?: creator_profilesOmit<ExtArgs> | null
    /**
     * The data needed to create a creator_profiles.
     */
    data: XOR<creator_profilesCreateInput, creator_profilesUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * creator_profiles createMany
   */
  export type creator_profilesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many creator_profiles.
     */
    data: creator_profilesCreateManyInput | creator_profilesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * creator_profiles createManyAndReturn
   */
  export type creator_profilesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the creator_profiles
     */
    select?: creator_profilesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the creator_profiles
     */
    omit?: creator_profilesOmit<ExtArgs> | null
    /**
     * The data used to create many creator_profiles.
     */
    data: creator_profilesCreateManyInput | creator_profilesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * creator_profiles update
   */
  export type creator_profilesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the creator_profiles
     */
    select?: creator_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the creator_profiles
     */
    omit?: creator_profilesOmit<ExtArgs> | null
    /**
     * The data needed to update a creator_profiles.
     */
    data: XOR<creator_profilesUpdateInput, creator_profilesUncheckedUpdateInput>
    /**
     * Choose, which creator_profiles to update.
     */
    where: creator_profilesWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * creator_profiles updateMany
   */
  export type creator_profilesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update creator_profiles.
     */
    data: XOR<creator_profilesUpdateManyMutationInput, creator_profilesUncheckedUpdateManyInput>
    /**
     * Filter which creator_profiles to update
     */
    where?: creator_profilesWhereInput
    /**
     * Limit how many creator_profiles to update.
     */
    limit?: number
  }

  /**
   * creator_profiles updateManyAndReturn
   */
  export type creator_profilesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the creator_profiles
     */
    select?: creator_profilesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the creator_profiles
     */
    omit?: creator_profilesOmit<ExtArgs> | null
    /**
     * The data used to update creator_profiles.
     */
    data: XOR<creator_profilesUpdateManyMutationInput, creator_profilesUncheckedUpdateManyInput>
    /**
     * Filter which creator_profiles to update
     */
    where?: creator_profilesWhereInput
    /**
     * Limit how many creator_profiles to update.
     */
    limit?: number
  }

  /**
   * creator_profiles upsert
   */
  export type creator_profilesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the creator_profiles
     */
    select?: creator_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the creator_profiles
     */
    omit?: creator_profilesOmit<ExtArgs> | null
    /**
     * The filter to search for the creator_profiles to update in case it exists.
     */
    where: creator_profilesWhereUniqueInput
    /**
     * In case the creator_profiles found by the `where` argument doesn't exist, create a new creator_profiles with this data.
     */
    create: XOR<creator_profilesCreateInput, creator_profilesUncheckedCreateInput>
    /**
     * In case the creator_profiles was found with the provided `where` argument, update it with this data.
     */
    update: XOR<creator_profilesUpdateInput, creator_profilesUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * creator_profiles delete
   */
  export type creator_profilesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the creator_profiles
     */
    select?: creator_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the creator_profiles
     */
    omit?: creator_profilesOmit<ExtArgs> | null
    /**
     * Filter which creator_profiles to delete.
     */
    where: creator_profilesWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * creator_profiles deleteMany
   */
  export type creator_profilesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which creator_profiles to delete
     */
    where?: creator_profilesWhereInput
    /**
     * Limit how many creator_profiles to delete.
     */
    limit?: number
  }

  /**
   * creator_profiles without action
   */
  export type creator_profilesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the creator_profiles
     */
    select?: creator_profilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the creator_profiles
     */
    omit?: creator_profilesOmit<ExtArgs> | null
  }


  /**
   * Model assessment_questions
   */

  export type AggregateAssessment_questions = {
    _count: Assessment_questionsCountAggregateOutputType | null
    _min: Assessment_questionsMinAggregateOutputType | null
    _max: Assessment_questionsMaxAggregateOutputType | null
  }

  export type Assessment_questionsMinAggregateOutputType = {
    id: string | null
    courseId: string | null
    sectionId: string | null
    question: string | null
    correct: string | null
    topic: string | null
    difficulty: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Assessment_questionsMaxAggregateOutputType = {
    id: string | null
    courseId: string | null
    sectionId: string | null
    question: string | null
    correct: string | null
    topic: string | null
    difficulty: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type Assessment_questionsCountAggregateOutputType = {
    id: number
    courseId: number
    sectionId: number
    question: number
    options: number
    correct: number
    topic: number
    difficulty: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type Assessment_questionsMinAggregateInputType = {
    id?: true
    courseId?: true
    sectionId?: true
    question?: true
    correct?: true
    topic?: true
    difficulty?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Assessment_questionsMaxAggregateInputType = {
    id?: true
    courseId?: true
    sectionId?: true
    question?: true
    correct?: true
    topic?: true
    difficulty?: true
    createdAt?: true
    updatedAt?: true
  }

  export type Assessment_questionsCountAggregateInputType = {
    id?: true
    courseId?: true
    sectionId?: true
    question?: true
    options?: true
    correct?: true
    topic?: true
    difficulty?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type Assessment_questionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which assessment_questions to aggregate.
     */
    where?: assessment_questionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of assessment_questions to fetch.
     */
    orderBy?: assessment_questionsOrderByWithRelationInput | assessment_questionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: assessment_questionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` assessment_questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` assessment_questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned assessment_questions
    **/
    _count?: true | Assessment_questionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Assessment_questionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Assessment_questionsMaxAggregateInputType
  }

  export type GetAssessment_questionsAggregateType<T extends Assessment_questionsAggregateArgs> = {
        [P in keyof T & keyof AggregateAssessment_questions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAssessment_questions[P]>
      : GetScalarType<T[P], AggregateAssessment_questions[P]>
  }




  export type assessment_questionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: assessment_questionsWhereInput
    orderBy?: assessment_questionsOrderByWithAggregationInput | assessment_questionsOrderByWithAggregationInput[]
    by: Assessment_questionsScalarFieldEnum[] | Assessment_questionsScalarFieldEnum
    having?: assessment_questionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Assessment_questionsCountAggregateInputType | true
    _min?: Assessment_questionsMinAggregateInputType
    _max?: Assessment_questionsMaxAggregateInputType
  }

  export type Assessment_questionsGroupByOutputType = {
    id: string
    courseId: string
    sectionId: string | null
    question: string
    options: JsonValue
    correct: string
    topic: string
    difficulty: string
    createdAt: Date
    updatedAt: Date
    _count: Assessment_questionsCountAggregateOutputType | null
    _min: Assessment_questionsMinAggregateOutputType | null
    _max: Assessment_questionsMaxAggregateOutputType | null
  }

  type GetAssessment_questionsGroupByPayload<T extends assessment_questionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Assessment_questionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Assessment_questionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Assessment_questionsGroupByOutputType[P]>
            : GetScalarType<T[P], Assessment_questionsGroupByOutputType[P]>
        }
      >
    >


  export type assessment_questionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    courseId?: boolean
    sectionId?: boolean
    question?: boolean
    options?: boolean
    correct?: boolean
    topic?: boolean
    difficulty?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    courses?: boolean | coursesDefaultArgs<ExtArgs>
    sections?: boolean | assessment_questions$sectionsArgs<ExtArgs>
  }, ExtArgs["result"]["assessment_questions"]>

  export type assessment_questionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    courseId?: boolean
    sectionId?: boolean
    question?: boolean
    options?: boolean
    correct?: boolean
    topic?: boolean
    difficulty?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    courses?: boolean | coursesDefaultArgs<ExtArgs>
    sections?: boolean | assessment_questions$sectionsArgs<ExtArgs>
  }, ExtArgs["result"]["assessment_questions"]>

  export type assessment_questionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    courseId?: boolean
    sectionId?: boolean
    question?: boolean
    options?: boolean
    correct?: boolean
    topic?: boolean
    difficulty?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    courses?: boolean | coursesDefaultArgs<ExtArgs>
    sections?: boolean | assessment_questions$sectionsArgs<ExtArgs>
  }, ExtArgs["result"]["assessment_questions"]>

  export type assessment_questionsSelectScalar = {
    id?: boolean
    courseId?: boolean
    sectionId?: boolean
    question?: boolean
    options?: boolean
    correct?: boolean
    topic?: boolean
    difficulty?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type assessment_questionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "courseId" | "sectionId" | "question" | "options" | "correct" | "topic" | "difficulty" | "createdAt" | "updatedAt", ExtArgs["result"]["assessment_questions"]>
  export type assessment_questionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courses?: boolean | coursesDefaultArgs<ExtArgs>
    sections?: boolean | assessment_questions$sectionsArgs<ExtArgs>
  }
  export type assessment_questionsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courses?: boolean | coursesDefaultArgs<ExtArgs>
    sections?: boolean | assessment_questions$sectionsArgs<ExtArgs>
  }
  export type assessment_questionsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courses?: boolean | coursesDefaultArgs<ExtArgs>
    sections?: boolean | assessment_questions$sectionsArgs<ExtArgs>
  }

  export type $assessment_questionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "assessment_questions"
    objects: {
      courses: Prisma.$coursesPayload<ExtArgs>
      sections: Prisma.$sectionsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      courseId: string
      sectionId: string | null
      question: string
      options: Prisma.JsonValue
      correct: string
      topic: string
      difficulty: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["assessment_questions"]>
    composites: {}
  }

  type assessment_questionsGetPayload<S extends boolean | null | undefined | assessment_questionsDefaultArgs> = $Result.GetResult<Prisma.$assessment_questionsPayload, S>

  type assessment_questionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<assessment_questionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: Assessment_questionsCountAggregateInputType | true
    }

  export interface assessment_questionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['assessment_questions'], meta: { name: 'assessment_questions' } }
    /**
     * Find zero or one Assessment_questions that matches the filter.
     * @param {assessment_questionsFindUniqueArgs} args - Arguments to find a Assessment_questions
     * @example
     * // Get one Assessment_questions
     * const assessment_questions = await prisma.assessment_questions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends assessment_questionsFindUniqueArgs>(args: SelectSubset<T, assessment_questionsFindUniqueArgs<ExtArgs>>): Prisma__assessment_questionsClient<$Result.GetResult<Prisma.$assessment_questionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Assessment_questions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {assessment_questionsFindUniqueOrThrowArgs} args - Arguments to find a Assessment_questions
     * @example
     * // Get one Assessment_questions
     * const assessment_questions = await prisma.assessment_questions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends assessment_questionsFindUniqueOrThrowArgs>(args: SelectSubset<T, assessment_questionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__assessment_questionsClient<$Result.GetResult<Prisma.$assessment_questionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Assessment_questions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {assessment_questionsFindFirstArgs} args - Arguments to find a Assessment_questions
     * @example
     * // Get one Assessment_questions
     * const assessment_questions = await prisma.assessment_questions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends assessment_questionsFindFirstArgs>(args?: SelectSubset<T, assessment_questionsFindFirstArgs<ExtArgs>>): Prisma__assessment_questionsClient<$Result.GetResult<Prisma.$assessment_questionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Assessment_questions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {assessment_questionsFindFirstOrThrowArgs} args - Arguments to find a Assessment_questions
     * @example
     * // Get one Assessment_questions
     * const assessment_questions = await prisma.assessment_questions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends assessment_questionsFindFirstOrThrowArgs>(args?: SelectSubset<T, assessment_questionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__assessment_questionsClient<$Result.GetResult<Prisma.$assessment_questionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Assessment_questions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {assessment_questionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Assessment_questions
     * const assessment_questions = await prisma.assessment_questions.findMany()
     * 
     * // Get first 10 Assessment_questions
     * const assessment_questions = await prisma.assessment_questions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assessment_questionsWithIdOnly = await prisma.assessment_questions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends assessment_questionsFindManyArgs>(args?: SelectSubset<T, assessment_questionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$assessment_questionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Assessment_questions.
     * @param {assessment_questionsCreateArgs} args - Arguments to create a Assessment_questions.
     * @example
     * // Create one Assessment_questions
     * const Assessment_questions = await prisma.assessment_questions.create({
     *   data: {
     *     // ... data to create a Assessment_questions
     *   }
     * })
     * 
     */
    create<T extends assessment_questionsCreateArgs>(args: SelectSubset<T, assessment_questionsCreateArgs<ExtArgs>>): Prisma__assessment_questionsClient<$Result.GetResult<Prisma.$assessment_questionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Assessment_questions.
     * @param {assessment_questionsCreateManyArgs} args - Arguments to create many Assessment_questions.
     * @example
     * // Create many Assessment_questions
     * const assessment_questions = await prisma.assessment_questions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends assessment_questionsCreateManyArgs>(args?: SelectSubset<T, assessment_questionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Assessment_questions and returns the data saved in the database.
     * @param {assessment_questionsCreateManyAndReturnArgs} args - Arguments to create many Assessment_questions.
     * @example
     * // Create many Assessment_questions
     * const assessment_questions = await prisma.assessment_questions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Assessment_questions and only return the `id`
     * const assessment_questionsWithIdOnly = await prisma.assessment_questions.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends assessment_questionsCreateManyAndReturnArgs>(args?: SelectSubset<T, assessment_questionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$assessment_questionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Assessment_questions.
     * @param {assessment_questionsDeleteArgs} args - Arguments to delete one Assessment_questions.
     * @example
     * // Delete one Assessment_questions
     * const Assessment_questions = await prisma.assessment_questions.delete({
     *   where: {
     *     // ... filter to delete one Assessment_questions
     *   }
     * })
     * 
     */
    delete<T extends assessment_questionsDeleteArgs>(args: SelectSubset<T, assessment_questionsDeleteArgs<ExtArgs>>): Prisma__assessment_questionsClient<$Result.GetResult<Prisma.$assessment_questionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Assessment_questions.
     * @param {assessment_questionsUpdateArgs} args - Arguments to update one Assessment_questions.
     * @example
     * // Update one Assessment_questions
     * const assessment_questions = await prisma.assessment_questions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends assessment_questionsUpdateArgs>(args: SelectSubset<T, assessment_questionsUpdateArgs<ExtArgs>>): Prisma__assessment_questionsClient<$Result.GetResult<Prisma.$assessment_questionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Assessment_questions.
     * @param {assessment_questionsDeleteManyArgs} args - Arguments to filter Assessment_questions to delete.
     * @example
     * // Delete a few Assessment_questions
     * const { count } = await prisma.assessment_questions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends assessment_questionsDeleteManyArgs>(args?: SelectSubset<T, assessment_questionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Assessment_questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {assessment_questionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Assessment_questions
     * const assessment_questions = await prisma.assessment_questions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends assessment_questionsUpdateManyArgs>(args: SelectSubset<T, assessment_questionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Assessment_questions and returns the data updated in the database.
     * @param {assessment_questionsUpdateManyAndReturnArgs} args - Arguments to update many Assessment_questions.
     * @example
     * // Update many Assessment_questions
     * const assessment_questions = await prisma.assessment_questions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Assessment_questions and only return the `id`
     * const assessment_questionsWithIdOnly = await prisma.assessment_questions.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends assessment_questionsUpdateManyAndReturnArgs>(args: SelectSubset<T, assessment_questionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$assessment_questionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Assessment_questions.
     * @param {assessment_questionsUpsertArgs} args - Arguments to update or create a Assessment_questions.
     * @example
     * // Update or create a Assessment_questions
     * const assessment_questions = await prisma.assessment_questions.upsert({
     *   create: {
     *     // ... data to create a Assessment_questions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Assessment_questions we want to update
     *   }
     * })
     */
    upsert<T extends assessment_questionsUpsertArgs>(args: SelectSubset<T, assessment_questionsUpsertArgs<ExtArgs>>): Prisma__assessment_questionsClient<$Result.GetResult<Prisma.$assessment_questionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Assessment_questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {assessment_questionsCountArgs} args - Arguments to filter Assessment_questions to count.
     * @example
     * // Count the number of Assessment_questions
     * const count = await prisma.assessment_questions.count({
     *   where: {
     *     // ... the filter for the Assessment_questions we want to count
     *   }
     * })
    **/
    count<T extends assessment_questionsCountArgs>(
      args?: Subset<T, assessment_questionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Assessment_questionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Assessment_questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Assessment_questionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Assessment_questionsAggregateArgs>(args: Subset<T, Assessment_questionsAggregateArgs>): Prisma.PrismaPromise<GetAssessment_questionsAggregateType<T>>

    /**
     * Group by Assessment_questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {assessment_questionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends assessment_questionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: assessment_questionsGroupByArgs['orderBy'] }
        : { orderBy?: assessment_questionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, assessment_questionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssessment_questionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the assessment_questions model
   */
  readonly fields: assessment_questionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for assessment_questions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__assessment_questionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    courses<T extends coursesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, coursesDefaultArgs<ExtArgs>>): Prisma__coursesClient<$Result.GetResult<Prisma.$coursesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sections<T extends assessment_questions$sectionsArgs<ExtArgs> = {}>(args?: Subset<T, assessment_questions$sectionsArgs<ExtArgs>>): Prisma__sectionsClient<$Result.GetResult<Prisma.$sectionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the assessment_questions model
   */
  interface assessment_questionsFieldRefs {
    readonly id: FieldRef<"assessment_questions", 'String'>
    readonly courseId: FieldRef<"assessment_questions", 'String'>
    readonly sectionId: FieldRef<"assessment_questions", 'String'>
    readonly question: FieldRef<"assessment_questions", 'String'>
    readonly options: FieldRef<"assessment_questions", 'Json'>
    readonly correct: FieldRef<"assessment_questions", 'String'>
    readonly topic: FieldRef<"assessment_questions", 'String'>
    readonly difficulty: FieldRef<"assessment_questions", 'String'>
    readonly createdAt: FieldRef<"assessment_questions", 'DateTime'>
    readonly updatedAt: FieldRef<"assessment_questions", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * assessment_questions findUnique
   */
  export type assessment_questionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the assessment_questions
     */
    select?: assessment_questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the assessment_questions
     */
    omit?: assessment_questionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: assessment_questionsInclude<ExtArgs> | null
    /**
     * Filter, which assessment_questions to fetch.
     */
    where: assessment_questionsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * assessment_questions findUniqueOrThrow
   */
  export type assessment_questionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the assessment_questions
     */
    select?: assessment_questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the assessment_questions
     */
    omit?: assessment_questionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: assessment_questionsInclude<ExtArgs> | null
    /**
     * Filter, which assessment_questions to fetch.
     */
    where: assessment_questionsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * assessment_questions findFirst
   */
  export type assessment_questionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the assessment_questions
     */
    select?: assessment_questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the assessment_questions
     */
    omit?: assessment_questionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: assessment_questionsInclude<ExtArgs> | null
    /**
     * Filter, which assessment_questions to fetch.
     */
    where?: assessment_questionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of assessment_questions to fetch.
     */
    orderBy?: assessment_questionsOrderByWithRelationInput | assessment_questionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for assessment_questions.
     */
    cursor?: assessment_questionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` assessment_questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` assessment_questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of assessment_questions.
     */
    distinct?: Assessment_questionsScalarFieldEnum | Assessment_questionsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * assessment_questions findFirstOrThrow
   */
  export type assessment_questionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the assessment_questions
     */
    select?: assessment_questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the assessment_questions
     */
    omit?: assessment_questionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: assessment_questionsInclude<ExtArgs> | null
    /**
     * Filter, which assessment_questions to fetch.
     */
    where?: assessment_questionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of assessment_questions to fetch.
     */
    orderBy?: assessment_questionsOrderByWithRelationInput | assessment_questionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for assessment_questions.
     */
    cursor?: assessment_questionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` assessment_questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` assessment_questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of assessment_questions.
     */
    distinct?: Assessment_questionsScalarFieldEnum | Assessment_questionsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * assessment_questions findMany
   */
  export type assessment_questionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the assessment_questions
     */
    select?: assessment_questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the assessment_questions
     */
    omit?: assessment_questionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: assessment_questionsInclude<ExtArgs> | null
    /**
     * Filter, which assessment_questions to fetch.
     */
    where?: assessment_questionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of assessment_questions to fetch.
     */
    orderBy?: assessment_questionsOrderByWithRelationInput | assessment_questionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing assessment_questions.
     */
    cursor?: assessment_questionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` assessment_questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` assessment_questions.
     */
    skip?: number
    distinct?: Assessment_questionsScalarFieldEnum | Assessment_questionsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * assessment_questions create
   */
  export type assessment_questionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the assessment_questions
     */
    select?: assessment_questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the assessment_questions
     */
    omit?: assessment_questionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: assessment_questionsInclude<ExtArgs> | null
    /**
     * The data needed to create a assessment_questions.
     */
    data: XOR<assessment_questionsCreateInput, assessment_questionsUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * assessment_questions createMany
   */
  export type assessment_questionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many assessment_questions.
     */
    data: assessment_questionsCreateManyInput | assessment_questionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * assessment_questions createManyAndReturn
   */
  export type assessment_questionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the assessment_questions
     */
    select?: assessment_questionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the assessment_questions
     */
    omit?: assessment_questionsOmit<ExtArgs> | null
    /**
     * The data used to create many assessment_questions.
     */
    data: assessment_questionsCreateManyInput | assessment_questionsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: assessment_questionsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * assessment_questions update
   */
  export type assessment_questionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the assessment_questions
     */
    select?: assessment_questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the assessment_questions
     */
    omit?: assessment_questionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: assessment_questionsInclude<ExtArgs> | null
    /**
     * The data needed to update a assessment_questions.
     */
    data: XOR<assessment_questionsUpdateInput, assessment_questionsUncheckedUpdateInput>
    /**
     * Choose, which assessment_questions to update.
     */
    where: assessment_questionsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * assessment_questions updateMany
   */
  export type assessment_questionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update assessment_questions.
     */
    data: XOR<assessment_questionsUpdateManyMutationInput, assessment_questionsUncheckedUpdateManyInput>
    /**
     * Filter which assessment_questions to update
     */
    where?: assessment_questionsWhereInput
    /**
     * Limit how many assessment_questions to update.
     */
    limit?: number
  }

  /**
   * assessment_questions updateManyAndReturn
   */
  export type assessment_questionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the assessment_questions
     */
    select?: assessment_questionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the assessment_questions
     */
    omit?: assessment_questionsOmit<ExtArgs> | null
    /**
     * The data used to update assessment_questions.
     */
    data: XOR<assessment_questionsUpdateManyMutationInput, assessment_questionsUncheckedUpdateManyInput>
    /**
     * Filter which assessment_questions to update
     */
    where?: assessment_questionsWhereInput
    /**
     * Limit how many assessment_questions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: assessment_questionsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * assessment_questions upsert
   */
  export type assessment_questionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the assessment_questions
     */
    select?: assessment_questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the assessment_questions
     */
    omit?: assessment_questionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: assessment_questionsInclude<ExtArgs> | null
    /**
     * The filter to search for the assessment_questions to update in case it exists.
     */
    where: assessment_questionsWhereUniqueInput
    /**
     * In case the assessment_questions found by the `where` argument doesn't exist, create a new assessment_questions with this data.
     */
    create: XOR<assessment_questionsCreateInput, assessment_questionsUncheckedCreateInput>
    /**
     * In case the assessment_questions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<assessment_questionsUpdateInput, assessment_questionsUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * assessment_questions delete
   */
  export type assessment_questionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the assessment_questions
     */
    select?: assessment_questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the assessment_questions
     */
    omit?: assessment_questionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: assessment_questionsInclude<ExtArgs> | null
    /**
     * Filter which assessment_questions to delete.
     */
    where: assessment_questionsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * assessment_questions deleteMany
   */
  export type assessment_questionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which assessment_questions to delete
     */
    where?: assessment_questionsWhereInput
    /**
     * Limit how many assessment_questions to delete.
     */
    limit?: number
  }

  /**
   * assessment_questions.sections
   */
  export type assessment_questions$sectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sections
     */
    select?: sectionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sections
     */
    omit?: sectionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sectionsInclude<ExtArgs> | null
    where?: sectionsWhereInput
  }

  /**
   * assessment_questions without action
   */
  export type assessment_questionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the assessment_questions
     */
    select?: assessment_questionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the assessment_questions
     */
    omit?: assessment_questionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: assessment_questionsInclude<ExtArgs> | null
  }


  /**
   * Model user_assessments
   */

  export type AggregateUser_assessments = {
    _count: User_assessmentsCountAggregateOutputType | null
    _avg: User_assessmentsAvgAggregateOutputType | null
    _sum: User_assessmentsSumAggregateOutputType | null
    _min: User_assessmentsMinAggregateOutputType | null
    _max: User_assessmentsMaxAggregateOutputType | null
  }

  export type User_assessmentsAvgAggregateOutputType = {
    score: number | null
    durationSeconds: number | null
  }

  export type User_assessmentsSumAggregateOutputType = {
    score: number | null
    durationSeconds: number | null
  }

  export type User_assessmentsMinAggregateOutputType = {
    id: string | null
    userId: string | null
    courseId: string | null
    sectionId: string | null
    score: number | null
    type: string | null
    durationSeconds: number | null
    completedAt: Date | null
  }

  export type User_assessmentsMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    courseId: string | null
    sectionId: string | null
    score: number | null
    type: string | null
    durationSeconds: number | null
    completedAt: Date | null
  }

  export type User_assessmentsCountAggregateOutputType = {
    id: number
    userId: number
    courseId: number
    sectionId: number
    score: number
    type: number
    answers: number
    durationSeconds: number
    completedAt: number
    _all: number
  }


  export type User_assessmentsAvgAggregateInputType = {
    score?: true
    durationSeconds?: true
  }

  export type User_assessmentsSumAggregateInputType = {
    score?: true
    durationSeconds?: true
  }

  export type User_assessmentsMinAggregateInputType = {
    id?: true
    userId?: true
    courseId?: true
    sectionId?: true
    score?: true
    type?: true
    durationSeconds?: true
    completedAt?: true
  }

  export type User_assessmentsMaxAggregateInputType = {
    id?: true
    userId?: true
    courseId?: true
    sectionId?: true
    score?: true
    type?: true
    durationSeconds?: true
    completedAt?: true
  }

  export type User_assessmentsCountAggregateInputType = {
    id?: true
    userId?: true
    courseId?: true
    sectionId?: true
    score?: true
    type?: true
    answers?: true
    durationSeconds?: true
    completedAt?: true
    _all?: true
  }

  export type User_assessmentsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_assessments to aggregate.
     */
    where?: user_assessmentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_assessments to fetch.
     */
    orderBy?: user_assessmentsOrderByWithRelationInput | user_assessmentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_assessmentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_assessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_assessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_assessments
    **/
    _count?: true | User_assessmentsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: User_assessmentsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: User_assessmentsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_assessmentsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_assessmentsMaxAggregateInputType
  }

  export type GetUser_assessmentsAggregateType<T extends User_assessmentsAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_assessments]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_assessments[P]>
      : GetScalarType<T[P], AggregateUser_assessments[P]>
  }




  export type user_assessmentsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_assessmentsWhereInput
    orderBy?: user_assessmentsOrderByWithAggregationInput | user_assessmentsOrderByWithAggregationInput[]
    by: User_assessmentsScalarFieldEnum[] | User_assessmentsScalarFieldEnum
    having?: user_assessmentsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_assessmentsCountAggregateInputType | true
    _avg?: User_assessmentsAvgAggregateInputType
    _sum?: User_assessmentsSumAggregateInputType
    _min?: User_assessmentsMinAggregateInputType
    _max?: User_assessmentsMaxAggregateInputType
  }

  export type User_assessmentsGroupByOutputType = {
    id: string
    userId: string
    courseId: string
    sectionId: string | null
    score: number
    type: string
    answers: JsonValue
    durationSeconds: number | null
    completedAt: Date
    _count: User_assessmentsCountAggregateOutputType | null
    _avg: User_assessmentsAvgAggregateOutputType | null
    _sum: User_assessmentsSumAggregateOutputType | null
    _min: User_assessmentsMinAggregateOutputType | null
    _max: User_assessmentsMaxAggregateOutputType | null
  }

  type GetUser_assessmentsGroupByPayload<T extends user_assessmentsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<User_assessmentsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_assessmentsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_assessmentsGroupByOutputType[P]>
            : GetScalarType<T[P], User_assessmentsGroupByOutputType[P]>
        }
      >
    >


  export type user_assessmentsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    courseId?: boolean
    sectionId?: boolean
    score?: boolean
    type?: boolean
    answers?: boolean
    durationSeconds?: boolean
    completedAt?: boolean
    courses?: boolean | coursesDefaultArgs<ExtArgs>
    sections?: boolean | user_assessments$sectionsArgs<ExtArgs>
  }, ExtArgs["result"]["user_assessments"]>

  export type user_assessmentsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    courseId?: boolean
    sectionId?: boolean
    score?: boolean
    type?: boolean
    answers?: boolean
    durationSeconds?: boolean
    completedAt?: boolean
    courses?: boolean | coursesDefaultArgs<ExtArgs>
    sections?: boolean | user_assessments$sectionsArgs<ExtArgs>
  }, ExtArgs["result"]["user_assessments"]>

  export type user_assessmentsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    courseId?: boolean
    sectionId?: boolean
    score?: boolean
    type?: boolean
    answers?: boolean
    durationSeconds?: boolean
    completedAt?: boolean
    courses?: boolean | coursesDefaultArgs<ExtArgs>
    sections?: boolean | user_assessments$sectionsArgs<ExtArgs>
  }, ExtArgs["result"]["user_assessments"]>

  export type user_assessmentsSelectScalar = {
    id?: boolean
    userId?: boolean
    courseId?: boolean
    sectionId?: boolean
    score?: boolean
    type?: boolean
    answers?: boolean
    durationSeconds?: boolean
    completedAt?: boolean
  }

  export type user_assessmentsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "courseId" | "sectionId" | "score" | "type" | "answers" | "durationSeconds" | "completedAt", ExtArgs["result"]["user_assessments"]>
  export type user_assessmentsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courses?: boolean | coursesDefaultArgs<ExtArgs>
    sections?: boolean | user_assessments$sectionsArgs<ExtArgs>
  }
  export type user_assessmentsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courses?: boolean | coursesDefaultArgs<ExtArgs>
    sections?: boolean | user_assessments$sectionsArgs<ExtArgs>
  }
  export type user_assessmentsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courses?: boolean | coursesDefaultArgs<ExtArgs>
    sections?: boolean | user_assessments$sectionsArgs<ExtArgs>
  }

  export type $user_assessmentsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user_assessments"
    objects: {
      courses: Prisma.$coursesPayload<ExtArgs>
      sections: Prisma.$sectionsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      courseId: string
      sectionId: string | null
      score: number
      type: string
      answers: Prisma.JsonValue
      durationSeconds: number | null
      completedAt: Date
    }, ExtArgs["result"]["user_assessments"]>
    composites: {}
  }

  type user_assessmentsGetPayload<S extends boolean | null | undefined | user_assessmentsDefaultArgs> = $Result.GetResult<Prisma.$user_assessmentsPayload, S>

  type user_assessmentsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<user_assessmentsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: User_assessmentsCountAggregateInputType | true
    }

  export interface user_assessmentsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_assessments'], meta: { name: 'user_assessments' } }
    /**
     * Find zero or one User_assessments that matches the filter.
     * @param {user_assessmentsFindUniqueArgs} args - Arguments to find a User_assessments
     * @example
     * // Get one User_assessments
     * const user_assessments = await prisma.user_assessments.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends user_assessmentsFindUniqueArgs>(args: SelectSubset<T, user_assessmentsFindUniqueArgs<ExtArgs>>): Prisma__user_assessmentsClient<$Result.GetResult<Prisma.$user_assessmentsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User_assessments that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {user_assessmentsFindUniqueOrThrowArgs} args - Arguments to find a User_assessments
     * @example
     * // Get one User_assessments
     * const user_assessments = await prisma.user_assessments.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends user_assessmentsFindUniqueOrThrowArgs>(args: SelectSubset<T, user_assessmentsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__user_assessmentsClient<$Result.GetResult<Prisma.$user_assessmentsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User_assessments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_assessmentsFindFirstArgs} args - Arguments to find a User_assessments
     * @example
     * // Get one User_assessments
     * const user_assessments = await prisma.user_assessments.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends user_assessmentsFindFirstArgs>(args?: SelectSubset<T, user_assessmentsFindFirstArgs<ExtArgs>>): Prisma__user_assessmentsClient<$Result.GetResult<Prisma.$user_assessmentsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User_assessments that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_assessmentsFindFirstOrThrowArgs} args - Arguments to find a User_assessments
     * @example
     * // Get one User_assessments
     * const user_assessments = await prisma.user_assessments.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends user_assessmentsFindFirstOrThrowArgs>(args?: SelectSubset<T, user_assessmentsFindFirstOrThrowArgs<ExtArgs>>): Prisma__user_assessmentsClient<$Result.GetResult<Prisma.$user_assessmentsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more User_assessments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_assessmentsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_assessments
     * const user_assessments = await prisma.user_assessments.findMany()
     * 
     * // Get first 10 User_assessments
     * const user_assessments = await prisma.user_assessments.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const user_assessmentsWithIdOnly = await prisma.user_assessments.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends user_assessmentsFindManyArgs>(args?: SelectSubset<T, user_assessmentsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_assessmentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User_assessments.
     * @param {user_assessmentsCreateArgs} args - Arguments to create a User_assessments.
     * @example
     * // Create one User_assessments
     * const User_assessments = await prisma.user_assessments.create({
     *   data: {
     *     // ... data to create a User_assessments
     *   }
     * })
     * 
     */
    create<T extends user_assessmentsCreateArgs>(args: SelectSubset<T, user_assessmentsCreateArgs<ExtArgs>>): Prisma__user_assessmentsClient<$Result.GetResult<Prisma.$user_assessmentsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many User_assessments.
     * @param {user_assessmentsCreateManyArgs} args - Arguments to create many User_assessments.
     * @example
     * // Create many User_assessments
     * const user_assessments = await prisma.user_assessments.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends user_assessmentsCreateManyArgs>(args?: SelectSubset<T, user_assessmentsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many User_assessments and returns the data saved in the database.
     * @param {user_assessmentsCreateManyAndReturnArgs} args - Arguments to create many User_assessments.
     * @example
     * // Create many User_assessments
     * const user_assessments = await prisma.user_assessments.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many User_assessments and only return the `id`
     * const user_assessmentsWithIdOnly = await prisma.user_assessments.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends user_assessmentsCreateManyAndReturnArgs>(args?: SelectSubset<T, user_assessmentsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_assessmentsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User_assessments.
     * @param {user_assessmentsDeleteArgs} args - Arguments to delete one User_assessments.
     * @example
     * // Delete one User_assessments
     * const User_assessments = await prisma.user_assessments.delete({
     *   where: {
     *     // ... filter to delete one User_assessments
     *   }
     * })
     * 
     */
    delete<T extends user_assessmentsDeleteArgs>(args: SelectSubset<T, user_assessmentsDeleteArgs<ExtArgs>>): Prisma__user_assessmentsClient<$Result.GetResult<Prisma.$user_assessmentsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User_assessments.
     * @param {user_assessmentsUpdateArgs} args - Arguments to update one User_assessments.
     * @example
     * // Update one User_assessments
     * const user_assessments = await prisma.user_assessments.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends user_assessmentsUpdateArgs>(args: SelectSubset<T, user_assessmentsUpdateArgs<ExtArgs>>): Prisma__user_assessmentsClient<$Result.GetResult<Prisma.$user_assessmentsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more User_assessments.
     * @param {user_assessmentsDeleteManyArgs} args - Arguments to filter User_assessments to delete.
     * @example
     * // Delete a few User_assessments
     * const { count } = await prisma.user_assessments.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends user_assessmentsDeleteManyArgs>(args?: SelectSubset<T, user_assessmentsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_assessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_assessmentsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_assessments
     * const user_assessments = await prisma.user_assessments.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends user_assessmentsUpdateManyArgs>(args: SelectSubset<T, user_assessmentsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_assessments and returns the data updated in the database.
     * @param {user_assessmentsUpdateManyAndReturnArgs} args - Arguments to update many User_assessments.
     * @example
     * // Update many User_assessments
     * const user_assessments = await prisma.user_assessments.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more User_assessments and only return the `id`
     * const user_assessmentsWithIdOnly = await prisma.user_assessments.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends user_assessmentsUpdateManyAndReturnArgs>(args: SelectSubset<T, user_assessmentsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_assessmentsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User_assessments.
     * @param {user_assessmentsUpsertArgs} args - Arguments to update or create a User_assessments.
     * @example
     * // Update or create a User_assessments
     * const user_assessments = await prisma.user_assessments.upsert({
     *   create: {
     *     // ... data to create a User_assessments
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_assessments we want to update
     *   }
     * })
     */
    upsert<T extends user_assessmentsUpsertArgs>(args: SelectSubset<T, user_assessmentsUpsertArgs<ExtArgs>>): Prisma__user_assessmentsClient<$Result.GetResult<Prisma.$user_assessmentsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of User_assessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_assessmentsCountArgs} args - Arguments to filter User_assessments to count.
     * @example
     * // Count the number of User_assessments
     * const count = await prisma.user_assessments.count({
     *   where: {
     *     // ... the filter for the User_assessments we want to count
     *   }
     * })
    **/
    count<T extends user_assessmentsCountArgs>(
      args?: Subset<T, user_assessmentsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_assessmentsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_assessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_assessmentsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_assessmentsAggregateArgs>(args: Subset<T, User_assessmentsAggregateArgs>): Prisma.PrismaPromise<GetUser_assessmentsAggregateType<T>>

    /**
     * Group by User_assessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_assessmentsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends user_assessmentsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: user_assessmentsGroupByArgs['orderBy'] }
        : { orderBy?: user_assessmentsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, user_assessmentsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_assessmentsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user_assessments model
   */
  readonly fields: user_assessmentsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user_assessments.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__user_assessmentsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    courses<T extends coursesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, coursesDefaultArgs<ExtArgs>>): Prisma__coursesClient<$Result.GetResult<Prisma.$coursesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sections<T extends user_assessments$sectionsArgs<ExtArgs> = {}>(args?: Subset<T, user_assessments$sectionsArgs<ExtArgs>>): Prisma__sectionsClient<$Result.GetResult<Prisma.$sectionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the user_assessments model
   */
  interface user_assessmentsFieldRefs {
    readonly id: FieldRef<"user_assessments", 'String'>
    readonly userId: FieldRef<"user_assessments", 'String'>
    readonly courseId: FieldRef<"user_assessments", 'String'>
    readonly sectionId: FieldRef<"user_assessments", 'String'>
    readonly score: FieldRef<"user_assessments", 'Float'>
    readonly type: FieldRef<"user_assessments", 'String'>
    readonly answers: FieldRef<"user_assessments", 'Json'>
    readonly durationSeconds: FieldRef<"user_assessments", 'Int'>
    readonly completedAt: FieldRef<"user_assessments", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * user_assessments findUnique
   */
  export type user_assessmentsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_assessments
     */
    select?: user_assessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_assessments
     */
    omit?: user_assessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_assessmentsInclude<ExtArgs> | null
    /**
     * Filter, which user_assessments to fetch.
     */
    where: user_assessmentsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * user_assessments findUniqueOrThrow
   */
  export type user_assessmentsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_assessments
     */
    select?: user_assessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_assessments
     */
    omit?: user_assessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_assessmentsInclude<ExtArgs> | null
    /**
     * Filter, which user_assessments to fetch.
     */
    where: user_assessmentsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * user_assessments findFirst
   */
  export type user_assessmentsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_assessments
     */
    select?: user_assessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_assessments
     */
    omit?: user_assessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_assessmentsInclude<ExtArgs> | null
    /**
     * Filter, which user_assessments to fetch.
     */
    where?: user_assessmentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_assessments to fetch.
     */
    orderBy?: user_assessmentsOrderByWithRelationInput | user_assessmentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_assessments.
     */
    cursor?: user_assessmentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_assessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_assessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_assessments.
     */
    distinct?: User_assessmentsScalarFieldEnum | User_assessmentsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * user_assessments findFirstOrThrow
   */
  export type user_assessmentsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_assessments
     */
    select?: user_assessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_assessments
     */
    omit?: user_assessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_assessmentsInclude<ExtArgs> | null
    /**
     * Filter, which user_assessments to fetch.
     */
    where?: user_assessmentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_assessments to fetch.
     */
    orderBy?: user_assessmentsOrderByWithRelationInput | user_assessmentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_assessments.
     */
    cursor?: user_assessmentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_assessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_assessments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_assessments.
     */
    distinct?: User_assessmentsScalarFieldEnum | User_assessmentsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * user_assessments findMany
   */
  export type user_assessmentsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_assessments
     */
    select?: user_assessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_assessments
     */
    omit?: user_assessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_assessmentsInclude<ExtArgs> | null
    /**
     * Filter, which user_assessments to fetch.
     */
    where?: user_assessmentsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_assessments to fetch.
     */
    orderBy?: user_assessmentsOrderByWithRelationInput | user_assessmentsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_assessments.
     */
    cursor?: user_assessmentsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_assessments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_assessments.
     */
    skip?: number
    distinct?: User_assessmentsScalarFieldEnum | User_assessmentsScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * user_assessments create
   */
  export type user_assessmentsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_assessments
     */
    select?: user_assessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_assessments
     */
    omit?: user_assessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_assessmentsInclude<ExtArgs> | null
    /**
     * The data needed to create a user_assessments.
     */
    data: XOR<user_assessmentsCreateInput, user_assessmentsUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * user_assessments createMany
   */
  export type user_assessmentsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_assessments.
     */
    data: user_assessmentsCreateManyInput | user_assessmentsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user_assessments createManyAndReturn
   */
  export type user_assessmentsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_assessments
     */
    select?: user_assessmentsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user_assessments
     */
    omit?: user_assessmentsOmit<ExtArgs> | null
    /**
     * The data used to create many user_assessments.
     */
    data: user_assessmentsCreateManyInput | user_assessmentsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_assessmentsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * user_assessments update
   */
  export type user_assessmentsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_assessments
     */
    select?: user_assessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_assessments
     */
    omit?: user_assessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_assessmentsInclude<ExtArgs> | null
    /**
     * The data needed to update a user_assessments.
     */
    data: XOR<user_assessmentsUpdateInput, user_assessmentsUncheckedUpdateInput>
    /**
     * Choose, which user_assessments to update.
     */
    where: user_assessmentsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * user_assessments updateMany
   */
  export type user_assessmentsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_assessments.
     */
    data: XOR<user_assessmentsUpdateManyMutationInput, user_assessmentsUncheckedUpdateManyInput>
    /**
     * Filter which user_assessments to update
     */
    where?: user_assessmentsWhereInput
    /**
     * Limit how many user_assessments to update.
     */
    limit?: number
  }

  /**
   * user_assessments updateManyAndReturn
   */
  export type user_assessmentsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_assessments
     */
    select?: user_assessmentsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the user_assessments
     */
    omit?: user_assessmentsOmit<ExtArgs> | null
    /**
     * The data used to update user_assessments.
     */
    data: XOR<user_assessmentsUpdateManyMutationInput, user_assessmentsUncheckedUpdateManyInput>
    /**
     * Filter which user_assessments to update
     */
    where?: user_assessmentsWhereInput
    /**
     * Limit how many user_assessments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_assessmentsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * user_assessments upsert
   */
  export type user_assessmentsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_assessments
     */
    select?: user_assessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_assessments
     */
    omit?: user_assessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_assessmentsInclude<ExtArgs> | null
    /**
     * The filter to search for the user_assessments to update in case it exists.
     */
    where: user_assessmentsWhereUniqueInput
    /**
     * In case the user_assessments found by the `where` argument doesn't exist, create a new user_assessments with this data.
     */
    create: XOR<user_assessmentsCreateInput, user_assessmentsUncheckedCreateInput>
    /**
     * In case the user_assessments was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_assessmentsUpdateInput, user_assessmentsUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * user_assessments delete
   */
  export type user_assessmentsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_assessments
     */
    select?: user_assessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_assessments
     */
    omit?: user_assessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_assessmentsInclude<ExtArgs> | null
    /**
     * Filter which user_assessments to delete.
     */
    where: user_assessmentsWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * user_assessments deleteMany
   */
  export type user_assessmentsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_assessments to delete
     */
    where?: user_assessmentsWhereInput
    /**
     * Limit how many user_assessments to delete.
     */
    limit?: number
  }

  /**
   * user_assessments.sections
   */
  export type user_assessments$sectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sections
     */
    select?: sectionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sections
     */
    omit?: sectionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sectionsInclude<ExtArgs> | null
    where?: sectionsWhereInput
  }

  /**
   * user_assessments without action
   */
  export type user_assessmentsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_assessments
     */
    select?: user_assessmentsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_assessments
     */
    omit?: user_assessmentsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: user_assessmentsInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const Course_completionsScalarFieldEnum: {
    id: 'id',
    courseId: 'courseId',
    userId: 'userId',
    percentage: 'percentage',
    completed: 'completed',
    completedAt: 'completedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type Course_completionsScalarFieldEnum = (typeof Course_completionsScalarFieldEnum)[keyof typeof Course_completionsScalarFieldEnum]


  export const RelationLoadStrategy: {
    query: 'query',
    join: 'join'
  };

  export type RelationLoadStrategy = (typeof RelationLoadStrategy)[keyof typeof RelationLoadStrategy]


  export const CoursesScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    title: 'title',
    description: 'description',
    thumbnail: 'thumbnail',
    status: 'status',
    students: 'students',
    lessons: 'lessons',
    duration: 'duration',
    rating: 'rating',
    category: 'category',
    difficulty: 'difficulty',
    creatorId: 'creatorId',
    outcomes: 'outcomes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CoursesScalarFieldEnum = (typeof CoursesScalarFieldEnum)[keyof typeof CoursesScalarFieldEnum]


  export const EnrollmentsScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    courseId: 'courseId',
    enrolledAt: 'enrolledAt',
    completed: 'completed',
    completedAt: 'completedAt'
  };

  export type EnrollmentsScalarFieldEnum = (typeof EnrollmentsScalarFieldEnum)[keyof typeof EnrollmentsScalarFieldEnum]


  export const Lesson_progressScalarFieldEnum: {
    id: 'id',
    lessonId: 'lessonId',
    userId: 'userId',
    completed: 'completed',
    completedAt: 'completedAt',
    createdAt: 'createdAt'
  };

  export type Lesson_progressScalarFieldEnum = (typeof Lesson_progressScalarFieldEnum)[keyof typeof Lesson_progressScalarFieldEnum]


  export const LessonsScalarFieldEnum: {
    id: 'id',
    sectionId: 'sectionId',
    order: 'order',
    title: 'title',
    content: 'content',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LessonsScalarFieldEnum = (typeof LessonsScalarFieldEnum)[keyof typeof LessonsScalarFieldEnum]


  export const SectionsScalarFieldEnum: {
    id: 'id',
    courseId: 'courseId',
    order: 'order',
    title: 'title',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SectionsScalarFieldEnum = (typeof SectionsScalarFieldEnum)[keyof typeof SectionsScalarFieldEnum]


  export const Creator_profilesScalarFieldEnum: {
    userId: 'userId',
    name: 'name',
    title: 'title',
    bio: 'bio',
    experience: 'experience',
    avatarUrl: 'avatarUrl',
    socialLinks: 'socialLinks',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type Creator_profilesScalarFieldEnum = (typeof Creator_profilesScalarFieldEnum)[keyof typeof Creator_profilesScalarFieldEnum]


  export const Assessment_questionsScalarFieldEnum: {
    id: 'id',
    courseId: 'courseId',
    sectionId: 'sectionId',
    question: 'question',
    options: 'options',
    correct: 'correct',
    topic: 'topic',
    difficulty: 'difficulty',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type Assessment_questionsScalarFieldEnum = (typeof Assessment_questionsScalarFieldEnum)[keyof typeof Assessment_questionsScalarFieldEnum]


  export const User_assessmentsScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    courseId: 'courseId',
    sectionId: 'sectionId',
    score: 'score',
    type: 'type',
    answers: 'answers',
    durationSeconds: 'durationSeconds',
    completedAt: 'completedAt'
  };

  export type User_assessmentsScalarFieldEnum = (typeof User_assessmentsScalarFieldEnum)[keyof typeof User_assessmentsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'CourseStatus'
   */
  export type EnumCourseStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CourseStatus'>
    


  /**
   * Reference to a field of type 'CourseStatus[]'
   */
  export type ListEnumCourseStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CourseStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    
  /**
   * Deep Input Types
   */


  export type course_completionsWhereInput = {
    AND?: course_completionsWhereInput | course_completionsWhereInput[]
    OR?: course_completionsWhereInput[]
    NOT?: course_completionsWhereInput | course_completionsWhereInput[]
    id?: StringFilter<"course_completions"> | string
    courseId?: StringFilter<"course_completions"> | string
    userId?: StringFilter<"course_completions"> | string
    percentage?: FloatFilter<"course_completions"> | number
    completed?: BoolFilter<"course_completions"> | boolean
    completedAt?: DateTimeNullableFilter<"course_completions"> | Date | string | null
    createdAt?: DateTimeFilter<"course_completions"> | Date | string
    updatedAt?: DateTimeFilter<"course_completions"> | Date | string
  }

  export type course_completionsOrderByWithRelationInput = {
    id?: SortOrder
    courseId?: SortOrder
    userId?: SortOrder
    percentage?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type course_completionsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    courseId_userId?: course_completionsCourseIdUserIdCompoundUniqueInput
    AND?: course_completionsWhereInput | course_completionsWhereInput[]
    OR?: course_completionsWhereInput[]
    NOT?: course_completionsWhereInput | course_completionsWhereInput[]
    courseId?: StringFilter<"course_completions"> | string
    userId?: StringFilter<"course_completions"> | string
    percentage?: FloatFilter<"course_completions"> | number
    completed?: BoolFilter<"course_completions"> | boolean
    completedAt?: DateTimeNullableFilter<"course_completions"> | Date | string | null
    createdAt?: DateTimeFilter<"course_completions"> | Date | string
    updatedAt?: DateTimeFilter<"course_completions"> | Date | string
  }, "id" | "courseId_userId">

  export type course_completionsOrderByWithAggregationInput = {
    id?: SortOrder
    courseId?: SortOrder
    userId?: SortOrder
    percentage?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: course_completionsCountOrderByAggregateInput
    _avg?: course_completionsAvgOrderByAggregateInput
    _max?: course_completionsMaxOrderByAggregateInput
    _min?: course_completionsMinOrderByAggregateInput
    _sum?: course_completionsSumOrderByAggregateInput
  }

  export type course_completionsScalarWhereWithAggregatesInput = {
    AND?: course_completionsScalarWhereWithAggregatesInput | course_completionsScalarWhereWithAggregatesInput[]
    OR?: course_completionsScalarWhereWithAggregatesInput[]
    NOT?: course_completionsScalarWhereWithAggregatesInput | course_completionsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"course_completions"> | string
    courseId?: StringWithAggregatesFilter<"course_completions"> | string
    userId?: StringWithAggregatesFilter<"course_completions"> | string
    percentage?: FloatWithAggregatesFilter<"course_completions"> | number
    completed?: BoolWithAggregatesFilter<"course_completions"> | boolean
    completedAt?: DateTimeNullableWithAggregatesFilter<"course_completions"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"course_completions"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"course_completions"> | Date | string
  }

  export type coursesWhereInput = {
    AND?: coursesWhereInput | coursesWhereInput[]
    OR?: coursesWhereInput[]
    NOT?: coursesWhereInput | coursesWhereInput[]
    id?: StringFilter<"courses"> | string
    slug?: StringFilter<"courses"> | string
    title?: StringFilter<"courses"> | string
    description?: StringFilter<"courses"> | string
    thumbnail?: StringNullableFilter<"courses"> | string | null
    status?: EnumCourseStatusFilter<"courses"> | $Enums.CourseStatus
    students?: IntFilter<"courses"> | number
    lessons?: IntFilter<"courses"> | number
    duration?: StringFilter<"courses"> | string
    rating?: FloatFilter<"courses"> | number
    category?: StringFilter<"courses"> | string
    difficulty?: StringNullableFilter<"courses"> | string | null
    creatorId?: StringFilter<"courses"> | string
    outcomes?: StringNullableListFilter<"courses">
    createdAt?: DateTimeFilter<"courses"> | Date | string
    updatedAt?: DateTimeFilter<"courses"> | Date | string
    enrollments?: EnrollmentsListRelationFilter
    sections?: SectionsListRelationFilter
    assessment_questions?: Assessment_questionsListRelationFilter
    user_assessments?: User_assessmentsListRelationFilter
  }

  export type coursesOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    description?: SortOrder
    thumbnail?: SortOrderInput | SortOrder
    status?: SortOrder
    students?: SortOrder
    lessons?: SortOrder
    duration?: SortOrder
    rating?: SortOrder
    category?: SortOrder
    difficulty?: SortOrderInput | SortOrder
    creatorId?: SortOrder
    outcomes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enrollments?: enrollmentsOrderByRelationAggregateInput
    sections?: sectionsOrderByRelationAggregateInput
    assessment_questions?: assessment_questionsOrderByRelationAggregateInput
    user_assessments?: user_assessmentsOrderByRelationAggregateInput
  }

  export type coursesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: coursesWhereInput | coursesWhereInput[]
    OR?: coursesWhereInput[]
    NOT?: coursesWhereInput | coursesWhereInput[]
    title?: StringFilter<"courses"> | string
    description?: StringFilter<"courses"> | string
    thumbnail?: StringNullableFilter<"courses"> | string | null
    status?: EnumCourseStatusFilter<"courses"> | $Enums.CourseStatus
    students?: IntFilter<"courses"> | number
    lessons?: IntFilter<"courses"> | number
    duration?: StringFilter<"courses"> | string
    rating?: FloatFilter<"courses"> | number
    category?: StringFilter<"courses"> | string
    difficulty?: StringNullableFilter<"courses"> | string | null
    creatorId?: StringFilter<"courses"> | string
    outcomes?: StringNullableListFilter<"courses">
    createdAt?: DateTimeFilter<"courses"> | Date | string
    updatedAt?: DateTimeFilter<"courses"> | Date | string
    enrollments?: EnrollmentsListRelationFilter
    sections?: SectionsListRelationFilter
    assessment_questions?: Assessment_questionsListRelationFilter
    user_assessments?: User_assessmentsListRelationFilter
  }, "id" | "slug">

  export type coursesOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    description?: SortOrder
    thumbnail?: SortOrderInput | SortOrder
    status?: SortOrder
    students?: SortOrder
    lessons?: SortOrder
    duration?: SortOrder
    rating?: SortOrder
    category?: SortOrder
    difficulty?: SortOrderInput | SortOrder
    creatorId?: SortOrder
    outcomes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: coursesCountOrderByAggregateInput
    _avg?: coursesAvgOrderByAggregateInput
    _max?: coursesMaxOrderByAggregateInput
    _min?: coursesMinOrderByAggregateInput
    _sum?: coursesSumOrderByAggregateInput
  }

  export type coursesScalarWhereWithAggregatesInput = {
    AND?: coursesScalarWhereWithAggregatesInput | coursesScalarWhereWithAggregatesInput[]
    OR?: coursesScalarWhereWithAggregatesInput[]
    NOT?: coursesScalarWhereWithAggregatesInput | coursesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"courses"> | string
    slug?: StringWithAggregatesFilter<"courses"> | string
    title?: StringWithAggregatesFilter<"courses"> | string
    description?: StringWithAggregatesFilter<"courses"> | string
    thumbnail?: StringNullableWithAggregatesFilter<"courses"> | string | null
    status?: EnumCourseStatusWithAggregatesFilter<"courses"> | $Enums.CourseStatus
    students?: IntWithAggregatesFilter<"courses"> | number
    lessons?: IntWithAggregatesFilter<"courses"> | number
    duration?: StringWithAggregatesFilter<"courses"> | string
    rating?: FloatWithAggregatesFilter<"courses"> | number
    category?: StringWithAggregatesFilter<"courses"> | string
    difficulty?: StringNullableWithAggregatesFilter<"courses"> | string | null
    creatorId?: StringWithAggregatesFilter<"courses"> | string
    outcomes?: StringNullableListFilter<"courses">
    createdAt?: DateTimeWithAggregatesFilter<"courses"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"courses"> | Date | string
  }

  export type enrollmentsWhereInput = {
    AND?: enrollmentsWhereInput | enrollmentsWhereInput[]
    OR?: enrollmentsWhereInput[]
    NOT?: enrollmentsWhereInput | enrollmentsWhereInput[]
    id?: StringFilter<"enrollments"> | string
    userId?: StringFilter<"enrollments"> | string
    courseId?: StringFilter<"enrollments"> | string
    enrolledAt?: DateTimeFilter<"enrollments"> | Date | string
    completed?: BoolFilter<"enrollments"> | boolean
    completedAt?: DateTimeNullableFilter<"enrollments"> | Date | string | null
    courses?: XOR<CoursesScalarRelationFilter, coursesWhereInput>
  }

  export type enrollmentsOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    enrolledAt?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    courses?: coursesOrderByWithRelationInput
  }

  export type enrollmentsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_courseId?: enrollmentsUserIdCourseIdCompoundUniqueInput
    AND?: enrollmentsWhereInput | enrollmentsWhereInput[]
    OR?: enrollmentsWhereInput[]
    NOT?: enrollmentsWhereInput | enrollmentsWhereInput[]
    userId?: StringFilter<"enrollments"> | string
    courseId?: StringFilter<"enrollments"> | string
    enrolledAt?: DateTimeFilter<"enrollments"> | Date | string
    completed?: BoolFilter<"enrollments"> | boolean
    completedAt?: DateTimeNullableFilter<"enrollments"> | Date | string | null
    courses?: XOR<CoursesScalarRelationFilter, coursesWhereInput>
  }, "id" | "userId_courseId">

  export type enrollmentsOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    enrolledAt?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: enrollmentsCountOrderByAggregateInput
    _max?: enrollmentsMaxOrderByAggregateInput
    _min?: enrollmentsMinOrderByAggregateInput
  }

  export type enrollmentsScalarWhereWithAggregatesInput = {
    AND?: enrollmentsScalarWhereWithAggregatesInput | enrollmentsScalarWhereWithAggregatesInput[]
    OR?: enrollmentsScalarWhereWithAggregatesInput[]
    NOT?: enrollmentsScalarWhereWithAggregatesInput | enrollmentsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"enrollments"> | string
    userId?: StringWithAggregatesFilter<"enrollments"> | string
    courseId?: StringWithAggregatesFilter<"enrollments"> | string
    enrolledAt?: DateTimeWithAggregatesFilter<"enrollments"> | Date | string
    completed?: BoolWithAggregatesFilter<"enrollments"> | boolean
    completedAt?: DateTimeNullableWithAggregatesFilter<"enrollments"> | Date | string | null
  }

  export type lesson_progressWhereInput = {
    AND?: lesson_progressWhereInput | lesson_progressWhereInput[]
    OR?: lesson_progressWhereInput[]
    NOT?: lesson_progressWhereInput | lesson_progressWhereInput[]
    id?: StringFilter<"lesson_progress"> | string
    lessonId?: StringFilter<"lesson_progress"> | string
    userId?: StringFilter<"lesson_progress"> | string
    completed?: BoolFilter<"lesson_progress"> | boolean
    completedAt?: DateTimeNullableFilter<"lesson_progress"> | Date | string | null
    createdAt?: DateTimeFilter<"lesson_progress"> | Date | string
    lessons?: XOR<LessonsScalarRelationFilter, lessonsWhereInput>
  }

  export type lesson_progressOrderByWithRelationInput = {
    id?: SortOrder
    lessonId?: SortOrder
    userId?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    lessons?: lessonsOrderByWithRelationInput
  }

  export type lesson_progressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    lessonId_userId?: lesson_progressLessonIdUserIdCompoundUniqueInput
    AND?: lesson_progressWhereInput | lesson_progressWhereInput[]
    OR?: lesson_progressWhereInput[]
    NOT?: lesson_progressWhereInput | lesson_progressWhereInput[]
    lessonId?: StringFilter<"lesson_progress"> | string
    userId?: StringFilter<"lesson_progress"> | string
    completed?: BoolFilter<"lesson_progress"> | boolean
    completedAt?: DateTimeNullableFilter<"lesson_progress"> | Date | string | null
    createdAt?: DateTimeFilter<"lesson_progress"> | Date | string
    lessons?: XOR<LessonsScalarRelationFilter, lessonsWhereInput>
  }, "id" | "lessonId_userId">

  export type lesson_progressOrderByWithAggregationInput = {
    id?: SortOrder
    lessonId?: SortOrder
    userId?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: lesson_progressCountOrderByAggregateInput
    _max?: lesson_progressMaxOrderByAggregateInput
    _min?: lesson_progressMinOrderByAggregateInput
  }

  export type lesson_progressScalarWhereWithAggregatesInput = {
    AND?: lesson_progressScalarWhereWithAggregatesInput | lesson_progressScalarWhereWithAggregatesInput[]
    OR?: lesson_progressScalarWhereWithAggregatesInput[]
    NOT?: lesson_progressScalarWhereWithAggregatesInput | lesson_progressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"lesson_progress"> | string
    lessonId?: StringWithAggregatesFilter<"lesson_progress"> | string
    userId?: StringWithAggregatesFilter<"lesson_progress"> | string
    completed?: BoolWithAggregatesFilter<"lesson_progress"> | boolean
    completedAt?: DateTimeNullableWithAggregatesFilter<"lesson_progress"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"lesson_progress"> | Date | string
  }

  export type lessonsWhereInput = {
    AND?: lessonsWhereInput | lessonsWhereInput[]
    OR?: lessonsWhereInput[]
    NOT?: lessonsWhereInput | lessonsWhereInput[]
    id?: StringFilter<"lessons"> | string
    sectionId?: StringFilter<"lessons"> | string
    order?: IntFilter<"lessons"> | number
    title?: StringFilter<"lessons"> | string
    content?: JsonFilter<"lessons">
    createdAt?: DateTimeFilter<"lessons"> | Date | string
    updatedAt?: DateTimeFilter<"lessons"> | Date | string
    lesson_progress?: Lesson_progressListRelationFilter
    sections?: XOR<SectionsScalarRelationFilter, sectionsWhereInput>
  }

  export type lessonsOrderByWithRelationInput = {
    id?: SortOrder
    sectionId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lesson_progress?: lesson_progressOrderByRelationAggregateInput
    sections?: sectionsOrderByWithRelationInput
  }

  export type lessonsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sectionId_order?: lessonsSectionIdOrderCompoundUniqueInput
    AND?: lessonsWhereInput | lessonsWhereInput[]
    OR?: lessonsWhereInput[]
    NOT?: lessonsWhereInput | lessonsWhereInput[]
    sectionId?: StringFilter<"lessons"> | string
    order?: IntFilter<"lessons"> | number
    title?: StringFilter<"lessons"> | string
    content?: JsonFilter<"lessons">
    createdAt?: DateTimeFilter<"lessons"> | Date | string
    updatedAt?: DateTimeFilter<"lessons"> | Date | string
    lesson_progress?: Lesson_progressListRelationFilter
    sections?: XOR<SectionsScalarRelationFilter, sectionsWhereInput>
  }, "id" | "sectionId_order">

  export type lessonsOrderByWithAggregationInput = {
    id?: SortOrder
    sectionId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: lessonsCountOrderByAggregateInput
    _avg?: lessonsAvgOrderByAggregateInput
    _max?: lessonsMaxOrderByAggregateInput
    _min?: lessonsMinOrderByAggregateInput
    _sum?: lessonsSumOrderByAggregateInput
  }

  export type lessonsScalarWhereWithAggregatesInput = {
    AND?: lessonsScalarWhereWithAggregatesInput | lessonsScalarWhereWithAggregatesInput[]
    OR?: lessonsScalarWhereWithAggregatesInput[]
    NOT?: lessonsScalarWhereWithAggregatesInput | lessonsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"lessons"> | string
    sectionId?: StringWithAggregatesFilter<"lessons"> | string
    order?: IntWithAggregatesFilter<"lessons"> | number
    title?: StringWithAggregatesFilter<"lessons"> | string
    content?: JsonWithAggregatesFilter<"lessons">
    createdAt?: DateTimeWithAggregatesFilter<"lessons"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"lessons"> | Date | string
  }

  export type sectionsWhereInput = {
    AND?: sectionsWhereInput | sectionsWhereInput[]
    OR?: sectionsWhereInput[]
    NOT?: sectionsWhereInput | sectionsWhereInput[]
    id?: StringFilter<"sections"> | string
    courseId?: StringFilter<"sections"> | string
    order?: IntFilter<"sections"> | number
    title?: StringFilter<"sections"> | string
    description?: StringNullableFilter<"sections"> | string | null
    createdAt?: DateTimeFilter<"sections"> | Date | string
    updatedAt?: DateTimeFilter<"sections"> | Date | string
    lessons?: LessonsListRelationFilter
    courses?: XOR<CoursesScalarRelationFilter, coursesWhereInput>
    assessment_questions?: Assessment_questionsListRelationFilter
    user_assessments?: User_assessmentsListRelationFilter
  }

  export type sectionsOrderByWithRelationInput = {
    id?: SortOrder
    courseId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lessons?: lessonsOrderByRelationAggregateInput
    courses?: coursesOrderByWithRelationInput
    assessment_questions?: assessment_questionsOrderByRelationAggregateInput
    user_assessments?: user_assessmentsOrderByRelationAggregateInput
  }

  export type sectionsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    courseId_order?: sectionsCourseIdOrderCompoundUniqueInput
    AND?: sectionsWhereInput | sectionsWhereInput[]
    OR?: sectionsWhereInput[]
    NOT?: sectionsWhereInput | sectionsWhereInput[]
    courseId?: StringFilter<"sections"> | string
    order?: IntFilter<"sections"> | number
    title?: StringFilter<"sections"> | string
    description?: StringNullableFilter<"sections"> | string | null
    createdAt?: DateTimeFilter<"sections"> | Date | string
    updatedAt?: DateTimeFilter<"sections"> | Date | string
    lessons?: LessonsListRelationFilter
    courses?: XOR<CoursesScalarRelationFilter, coursesWhereInput>
    assessment_questions?: Assessment_questionsListRelationFilter
    user_assessments?: User_assessmentsListRelationFilter
  }, "id" | "courseId_order">

  export type sectionsOrderByWithAggregationInput = {
    id?: SortOrder
    courseId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: sectionsCountOrderByAggregateInput
    _avg?: sectionsAvgOrderByAggregateInput
    _max?: sectionsMaxOrderByAggregateInput
    _min?: sectionsMinOrderByAggregateInput
    _sum?: sectionsSumOrderByAggregateInput
  }

  export type sectionsScalarWhereWithAggregatesInput = {
    AND?: sectionsScalarWhereWithAggregatesInput | sectionsScalarWhereWithAggregatesInput[]
    OR?: sectionsScalarWhereWithAggregatesInput[]
    NOT?: sectionsScalarWhereWithAggregatesInput | sectionsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"sections"> | string
    courseId?: StringWithAggregatesFilter<"sections"> | string
    order?: IntWithAggregatesFilter<"sections"> | number
    title?: StringWithAggregatesFilter<"sections"> | string
    description?: StringNullableWithAggregatesFilter<"sections"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"sections"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"sections"> | Date | string
  }

  export type creator_profilesWhereInput = {
    AND?: creator_profilesWhereInput | creator_profilesWhereInput[]
    OR?: creator_profilesWhereInput[]
    NOT?: creator_profilesWhereInput | creator_profilesWhereInput[]
    userId?: StringFilter<"creator_profiles"> | string
    name?: StringNullableFilter<"creator_profiles"> | string | null
    title?: StringNullableFilter<"creator_profiles"> | string | null
    bio?: StringNullableFilter<"creator_profiles"> | string | null
    experience?: StringNullableFilter<"creator_profiles"> | string | null
    avatarUrl?: StringNullableFilter<"creator_profiles"> | string | null
    socialLinks?: JsonNullableFilter<"creator_profiles">
    createdAt?: DateTimeFilter<"creator_profiles"> | Date | string
    updatedAt?: DateTimeFilter<"creator_profiles"> | Date | string
  }

  export type creator_profilesOrderByWithRelationInput = {
    userId?: SortOrder
    name?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    experience?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    socialLinks?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type creator_profilesWhereUniqueInput = Prisma.AtLeast<{
    userId?: string
    AND?: creator_profilesWhereInput | creator_profilesWhereInput[]
    OR?: creator_profilesWhereInput[]
    NOT?: creator_profilesWhereInput | creator_profilesWhereInput[]
    name?: StringNullableFilter<"creator_profiles"> | string | null
    title?: StringNullableFilter<"creator_profiles"> | string | null
    bio?: StringNullableFilter<"creator_profiles"> | string | null
    experience?: StringNullableFilter<"creator_profiles"> | string | null
    avatarUrl?: StringNullableFilter<"creator_profiles"> | string | null
    socialLinks?: JsonNullableFilter<"creator_profiles">
    createdAt?: DateTimeFilter<"creator_profiles"> | Date | string
    updatedAt?: DateTimeFilter<"creator_profiles"> | Date | string
  }, "userId">

  export type creator_profilesOrderByWithAggregationInput = {
    userId?: SortOrder
    name?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    experience?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    socialLinks?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: creator_profilesCountOrderByAggregateInput
    _max?: creator_profilesMaxOrderByAggregateInput
    _min?: creator_profilesMinOrderByAggregateInput
  }

  export type creator_profilesScalarWhereWithAggregatesInput = {
    AND?: creator_profilesScalarWhereWithAggregatesInput | creator_profilesScalarWhereWithAggregatesInput[]
    OR?: creator_profilesScalarWhereWithAggregatesInput[]
    NOT?: creator_profilesScalarWhereWithAggregatesInput | creator_profilesScalarWhereWithAggregatesInput[]
    userId?: StringWithAggregatesFilter<"creator_profiles"> | string
    name?: StringNullableWithAggregatesFilter<"creator_profiles"> | string | null
    title?: StringNullableWithAggregatesFilter<"creator_profiles"> | string | null
    bio?: StringNullableWithAggregatesFilter<"creator_profiles"> | string | null
    experience?: StringNullableWithAggregatesFilter<"creator_profiles"> | string | null
    avatarUrl?: StringNullableWithAggregatesFilter<"creator_profiles"> | string | null
    socialLinks?: JsonNullableWithAggregatesFilter<"creator_profiles">
    createdAt?: DateTimeWithAggregatesFilter<"creator_profiles"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"creator_profiles"> | Date | string
  }

  export type assessment_questionsWhereInput = {
    AND?: assessment_questionsWhereInput | assessment_questionsWhereInput[]
    OR?: assessment_questionsWhereInput[]
    NOT?: assessment_questionsWhereInput | assessment_questionsWhereInput[]
    id?: StringFilter<"assessment_questions"> | string
    courseId?: StringFilter<"assessment_questions"> | string
    sectionId?: StringNullableFilter<"assessment_questions"> | string | null
    question?: StringFilter<"assessment_questions"> | string
    options?: JsonFilter<"assessment_questions">
    correct?: StringFilter<"assessment_questions"> | string
    topic?: StringFilter<"assessment_questions"> | string
    difficulty?: StringFilter<"assessment_questions"> | string
    createdAt?: DateTimeFilter<"assessment_questions"> | Date | string
    updatedAt?: DateTimeFilter<"assessment_questions"> | Date | string
    courses?: XOR<CoursesScalarRelationFilter, coursesWhereInput>
    sections?: XOR<SectionsNullableScalarRelationFilter, sectionsWhereInput> | null
  }

  export type assessment_questionsOrderByWithRelationInput = {
    id?: SortOrder
    courseId?: SortOrder
    sectionId?: SortOrderInput | SortOrder
    question?: SortOrder
    options?: SortOrder
    correct?: SortOrder
    topic?: SortOrder
    difficulty?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    courses?: coursesOrderByWithRelationInput
    sections?: sectionsOrderByWithRelationInput
  }

  export type assessment_questionsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: assessment_questionsWhereInput | assessment_questionsWhereInput[]
    OR?: assessment_questionsWhereInput[]
    NOT?: assessment_questionsWhereInput | assessment_questionsWhereInput[]
    courseId?: StringFilter<"assessment_questions"> | string
    sectionId?: StringNullableFilter<"assessment_questions"> | string | null
    question?: StringFilter<"assessment_questions"> | string
    options?: JsonFilter<"assessment_questions">
    correct?: StringFilter<"assessment_questions"> | string
    topic?: StringFilter<"assessment_questions"> | string
    difficulty?: StringFilter<"assessment_questions"> | string
    createdAt?: DateTimeFilter<"assessment_questions"> | Date | string
    updatedAt?: DateTimeFilter<"assessment_questions"> | Date | string
    courses?: XOR<CoursesScalarRelationFilter, coursesWhereInput>
    sections?: XOR<SectionsNullableScalarRelationFilter, sectionsWhereInput> | null
  }, "id">

  export type assessment_questionsOrderByWithAggregationInput = {
    id?: SortOrder
    courseId?: SortOrder
    sectionId?: SortOrderInput | SortOrder
    question?: SortOrder
    options?: SortOrder
    correct?: SortOrder
    topic?: SortOrder
    difficulty?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: assessment_questionsCountOrderByAggregateInput
    _max?: assessment_questionsMaxOrderByAggregateInput
    _min?: assessment_questionsMinOrderByAggregateInput
  }

  export type assessment_questionsScalarWhereWithAggregatesInput = {
    AND?: assessment_questionsScalarWhereWithAggregatesInput | assessment_questionsScalarWhereWithAggregatesInput[]
    OR?: assessment_questionsScalarWhereWithAggregatesInput[]
    NOT?: assessment_questionsScalarWhereWithAggregatesInput | assessment_questionsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"assessment_questions"> | string
    courseId?: StringWithAggregatesFilter<"assessment_questions"> | string
    sectionId?: StringNullableWithAggregatesFilter<"assessment_questions"> | string | null
    question?: StringWithAggregatesFilter<"assessment_questions"> | string
    options?: JsonWithAggregatesFilter<"assessment_questions">
    correct?: StringWithAggregatesFilter<"assessment_questions"> | string
    topic?: StringWithAggregatesFilter<"assessment_questions"> | string
    difficulty?: StringWithAggregatesFilter<"assessment_questions"> | string
    createdAt?: DateTimeWithAggregatesFilter<"assessment_questions"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"assessment_questions"> | Date | string
  }

  export type user_assessmentsWhereInput = {
    AND?: user_assessmentsWhereInput | user_assessmentsWhereInput[]
    OR?: user_assessmentsWhereInput[]
    NOT?: user_assessmentsWhereInput | user_assessmentsWhereInput[]
    id?: StringFilter<"user_assessments"> | string
    userId?: StringFilter<"user_assessments"> | string
    courseId?: StringFilter<"user_assessments"> | string
    sectionId?: StringNullableFilter<"user_assessments"> | string | null
    score?: FloatFilter<"user_assessments"> | number
    type?: StringFilter<"user_assessments"> | string
    answers?: JsonFilter<"user_assessments">
    durationSeconds?: IntNullableFilter<"user_assessments"> | number | null
    completedAt?: DateTimeFilter<"user_assessments"> | Date | string
    courses?: XOR<CoursesScalarRelationFilter, coursesWhereInput>
    sections?: XOR<SectionsNullableScalarRelationFilter, sectionsWhereInput> | null
  }

  export type user_assessmentsOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    sectionId?: SortOrderInput | SortOrder
    score?: SortOrder
    type?: SortOrder
    answers?: SortOrder
    durationSeconds?: SortOrderInput | SortOrder
    completedAt?: SortOrder
    courses?: coursesOrderByWithRelationInput
    sections?: sectionsOrderByWithRelationInput
  }

  export type user_assessmentsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_courseId_sectionId_type?: user_assessmentsUserIdCourseIdSectionIdTypeCompoundUniqueInput
    AND?: user_assessmentsWhereInput | user_assessmentsWhereInput[]
    OR?: user_assessmentsWhereInput[]
    NOT?: user_assessmentsWhereInput | user_assessmentsWhereInput[]
    userId?: StringFilter<"user_assessments"> | string
    courseId?: StringFilter<"user_assessments"> | string
    sectionId?: StringNullableFilter<"user_assessments"> | string | null
    score?: FloatFilter<"user_assessments"> | number
    type?: StringFilter<"user_assessments"> | string
    answers?: JsonFilter<"user_assessments">
    durationSeconds?: IntNullableFilter<"user_assessments"> | number | null
    completedAt?: DateTimeFilter<"user_assessments"> | Date | string
    courses?: XOR<CoursesScalarRelationFilter, coursesWhereInput>
    sections?: XOR<SectionsNullableScalarRelationFilter, sectionsWhereInput> | null
  }, "id" | "userId_courseId_sectionId_type">

  export type user_assessmentsOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    sectionId?: SortOrderInput | SortOrder
    score?: SortOrder
    type?: SortOrder
    answers?: SortOrder
    durationSeconds?: SortOrderInput | SortOrder
    completedAt?: SortOrder
    _count?: user_assessmentsCountOrderByAggregateInput
    _avg?: user_assessmentsAvgOrderByAggregateInput
    _max?: user_assessmentsMaxOrderByAggregateInput
    _min?: user_assessmentsMinOrderByAggregateInput
    _sum?: user_assessmentsSumOrderByAggregateInput
  }

  export type user_assessmentsScalarWhereWithAggregatesInput = {
    AND?: user_assessmentsScalarWhereWithAggregatesInput | user_assessmentsScalarWhereWithAggregatesInput[]
    OR?: user_assessmentsScalarWhereWithAggregatesInput[]
    NOT?: user_assessmentsScalarWhereWithAggregatesInput | user_assessmentsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"user_assessments"> | string
    userId?: StringWithAggregatesFilter<"user_assessments"> | string
    courseId?: StringWithAggregatesFilter<"user_assessments"> | string
    sectionId?: StringNullableWithAggregatesFilter<"user_assessments"> | string | null
    score?: FloatWithAggregatesFilter<"user_assessments"> | number
    type?: StringWithAggregatesFilter<"user_assessments"> | string
    answers?: JsonWithAggregatesFilter<"user_assessments">
    durationSeconds?: IntNullableWithAggregatesFilter<"user_assessments"> | number | null
    completedAt?: DateTimeWithAggregatesFilter<"user_assessments"> | Date | string
  }

  export type course_completionsCreateInput = {
    id: string
    courseId: string
    userId: string
    percentage?: number
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type course_completionsUncheckedCreateInput = {
    id: string
    courseId: string
    userId: string
    percentage?: number
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type course_completionsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    percentage?: FloatFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type course_completionsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    percentage?: FloatFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type course_completionsCreateManyInput = {
    id: string
    courseId: string
    userId: string
    percentage?: number
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type course_completionsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    percentage?: FloatFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type course_completionsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    percentage?: FloatFieldUpdateOperationsInput | number
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type coursesCreateInput = {
    id: string
    slug: string
    title: string
    description: string
    thumbnail?: string | null
    status?: $Enums.CourseStatus
    students?: number
    lessons?: number
    duration?: string
    rating?: number
    category: string
    difficulty?: string | null
    creatorId: string
    outcomes?: coursesCreateoutcomesInput | string[]
    createdAt?: Date | string
    updatedAt: Date | string
    enrollments?: enrollmentsCreateNestedManyWithoutCoursesInput
    sections?: sectionsCreateNestedManyWithoutCoursesInput
    assessment_questions?: assessment_questionsCreateNestedManyWithoutCoursesInput
    user_assessments?: user_assessmentsCreateNestedManyWithoutCoursesInput
  }

  export type coursesUncheckedCreateInput = {
    id: string
    slug: string
    title: string
    description: string
    thumbnail?: string | null
    status?: $Enums.CourseStatus
    students?: number
    lessons?: number
    duration?: string
    rating?: number
    category: string
    difficulty?: string | null
    creatorId: string
    outcomes?: coursesCreateoutcomesInput | string[]
    createdAt?: Date | string
    updatedAt: Date | string
    enrollments?: enrollmentsUncheckedCreateNestedManyWithoutCoursesInput
    sections?: sectionsUncheckedCreateNestedManyWithoutCoursesInput
    assessment_questions?: assessment_questionsUncheckedCreateNestedManyWithoutCoursesInput
    user_assessments?: user_assessmentsUncheckedCreateNestedManyWithoutCoursesInput
  }

  export type coursesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCourseStatusFieldUpdateOperationsInput | $Enums.CourseStatus
    students?: IntFieldUpdateOperationsInput | number
    lessons?: IntFieldUpdateOperationsInput | number
    duration?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    creatorId?: StringFieldUpdateOperationsInput | string
    outcomes?: coursesUpdateoutcomesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: enrollmentsUpdateManyWithoutCoursesNestedInput
    sections?: sectionsUpdateManyWithoutCoursesNestedInput
    assessment_questions?: assessment_questionsUpdateManyWithoutCoursesNestedInput
    user_assessments?: user_assessmentsUpdateManyWithoutCoursesNestedInput
  }

  export type coursesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCourseStatusFieldUpdateOperationsInput | $Enums.CourseStatus
    students?: IntFieldUpdateOperationsInput | number
    lessons?: IntFieldUpdateOperationsInput | number
    duration?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    creatorId?: StringFieldUpdateOperationsInput | string
    outcomes?: coursesUpdateoutcomesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: enrollmentsUncheckedUpdateManyWithoutCoursesNestedInput
    sections?: sectionsUncheckedUpdateManyWithoutCoursesNestedInput
    assessment_questions?: assessment_questionsUncheckedUpdateManyWithoutCoursesNestedInput
    user_assessments?: user_assessmentsUncheckedUpdateManyWithoutCoursesNestedInput
  }

  export type coursesCreateManyInput = {
    id: string
    slug: string
    title: string
    description: string
    thumbnail?: string | null
    status?: $Enums.CourseStatus
    students?: number
    lessons?: number
    duration?: string
    rating?: number
    category: string
    difficulty?: string | null
    creatorId: string
    outcomes?: coursesCreateoutcomesInput | string[]
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type coursesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCourseStatusFieldUpdateOperationsInput | $Enums.CourseStatus
    students?: IntFieldUpdateOperationsInput | number
    lessons?: IntFieldUpdateOperationsInput | number
    duration?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    creatorId?: StringFieldUpdateOperationsInput | string
    outcomes?: coursesUpdateoutcomesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type coursesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCourseStatusFieldUpdateOperationsInput | $Enums.CourseStatus
    students?: IntFieldUpdateOperationsInput | number
    lessons?: IntFieldUpdateOperationsInput | number
    duration?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    creatorId?: StringFieldUpdateOperationsInput | string
    outcomes?: coursesUpdateoutcomesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type enrollmentsCreateInput = {
    id: string
    userId: string
    enrolledAt?: Date | string
    completed?: boolean
    completedAt?: Date | string | null
    courses: coursesCreateNestedOneWithoutEnrollmentsInput
  }

  export type enrollmentsUncheckedCreateInput = {
    id: string
    userId: string
    courseId: string
    enrolledAt?: Date | string
    completed?: boolean
    completedAt?: Date | string | null
  }

  export type enrollmentsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    courses?: coursesUpdateOneRequiredWithoutEnrollmentsNestedInput
  }

  export type enrollmentsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type enrollmentsCreateManyInput = {
    id: string
    userId: string
    courseId: string
    enrolledAt?: Date | string
    completed?: boolean
    completedAt?: Date | string | null
  }

  export type enrollmentsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type enrollmentsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type lesson_progressCreateInput = {
    id: string
    userId: string
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
    lessons: lessonsCreateNestedOneWithoutLesson_progressInput
  }

  export type lesson_progressUncheckedCreateInput = {
    id: string
    lessonId: string
    userId: string
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type lesson_progressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lessons?: lessonsUpdateOneRequiredWithoutLesson_progressNestedInput
  }

  export type lesson_progressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type lesson_progressCreateManyInput = {
    id: string
    lessonId: string
    userId: string
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type lesson_progressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type lesson_progressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type lessonsCreateInput = {
    id: string
    order: number
    title: string
    content: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt: Date | string
    lesson_progress?: lesson_progressCreateNestedManyWithoutLessonsInput
    sections: sectionsCreateNestedOneWithoutLessonsInput
  }

  export type lessonsUncheckedCreateInput = {
    id: string
    sectionId: string
    order: number
    title: string
    content: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt: Date | string
    lesson_progress?: lesson_progressUncheckedCreateNestedManyWithoutLessonsInput
  }

  export type lessonsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lesson_progress?: lesson_progressUpdateManyWithoutLessonsNestedInput
    sections?: sectionsUpdateOneRequiredWithoutLessonsNestedInput
  }

  export type lessonsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lesson_progress?: lesson_progressUncheckedUpdateManyWithoutLessonsNestedInput
  }

  export type lessonsCreateManyInput = {
    id: string
    sectionId: string
    order: number
    title: string
    content: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type lessonsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type lessonsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sectionsCreateInput = {
    id: string
    order: number
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    lessons?: lessonsCreateNestedManyWithoutSectionsInput
    courses: coursesCreateNestedOneWithoutSectionsInput
    assessment_questions?: assessment_questionsCreateNestedManyWithoutSectionsInput
    user_assessments?: user_assessmentsCreateNestedManyWithoutSectionsInput
  }

  export type sectionsUncheckedCreateInput = {
    id: string
    courseId: string
    order: number
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    lessons?: lessonsUncheckedCreateNestedManyWithoutSectionsInput
    assessment_questions?: assessment_questionsUncheckedCreateNestedManyWithoutSectionsInput
    user_assessments?: user_assessmentsUncheckedCreateNestedManyWithoutSectionsInput
  }

  export type sectionsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lessons?: lessonsUpdateManyWithoutSectionsNestedInput
    courses?: coursesUpdateOneRequiredWithoutSectionsNestedInput
    assessment_questions?: assessment_questionsUpdateManyWithoutSectionsNestedInput
    user_assessments?: user_assessmentsUpdateManyWithoutSectionsNestedInput
  }

  export type sectionsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lessons?: lessonsUncheckedUpdateManyWithoutSectionsNestedInput
    assessment_questions?: assessment_questionsUncheckedUpdateManyWithoutSectionsNestedInput
    user_assessments?: user_assessmentsUncheckedUpdateManyWithoutSectionsNestedInput
  }

  export type sectionsCreateManyInput = {
    id: string
    courseId: string
    order: number
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type sectionsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type sectionsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type creator_profilesCreateInput = {
    userId: string
    name?: string | null
    title?: string | null
    bio?: string | null
    experience?: string | null
    avatarUrl?: string | null
    socialLinks?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type creator_profilesUncheckedCreateInput = {
    userId: string
    name?: string | null
    title?: string | null
    bio?: string | null
    experience?: string | null
    avatarUrl?: string | null
    socialLinks?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type creator_profilesUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    experience?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    socialLinks?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type creator_profilesUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    experience?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    socialLinks?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type creator_profilesCreateManyInput = {
    userId: string
    name?: string | null
    title?: string | null
    bio?: string | null
    experience?: string | null
    avatarUrl?: string | null
    socialLinks?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type creator_profilesUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    experience?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    socialLinks?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type creator_profilesUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    experience?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    socialLinks?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type assessment_questionsCreateInput = {
    id?: string
    question: string
    options: JsonNullValueInput | InputJsonValue
    correct: string
    topic: string
    difficulty?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    courses: coursesCreateNestedOneWithoutAssessment_questionsInput
    sections?: sectionsCreateNestedOneWithoutAssessment_questionsInput
  }

  export type assessment_questionsUncheckedCreateInput = {
    id?: string
    courseId: string
    sectionId?: string | null
    question: string
    options: JsonNullValueInput | InputJsonValue
    correct: string
    topic: string
    difficulty?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type assessment_questionsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    correct?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courses?: coursesUpdateOneRequiredWithoutAssessment_questionsNestedInput
    sections?: sectionsUpdateOneWithoutAssessment_questionsNestedInput
  }

  export type assessment_questionsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    sectionId?: NullableStringFieldUpdateOperationsInput | string | null
    question?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    correct?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type assessment_questionsCreateManyInput = {
    id?: string
    courseId: string
    sectionId?: string | null
    question: string
    options: JsonNullValueInput | InputJsonValue
    correct: string
    topic: string
    difficulty?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type assessment_questionsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    correct?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type assessment_questionsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    sectionId?: NullableStringFieldUpdateOperationsInput | string | null
    question?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    correct?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_assessmentsCreateInput = {
    id?: string
    userId: string
    score: number
    type?: string
    answers: JsonNullValueInput | InputJsonValue
    durationSeconds?: number | null
    completedAt?: Date | string
    courses: coursesCreateNestedOneWithoutUser_assessmentsInput
    sections?: sectionsCreateNestedOneWithoutUser_assessmentsInput
  }

  export type user_assessmentsUncheckedCreateInput = {
    id?: string
    userId: string
    courseId: string
    sectionId?: string | null
    score: number
    type?: string
    answers: JsonNullValueInput | InputJsonValue
    durationSeconds?: number | null
    completedAt?: Date | string
  }

  export type user_assessmentsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courses?: coursesUpdateOneRequiredWithoutUser_assessmentsNestedInput
    sections?: sectionsUpdateOneWithoutUser_assessmentsNestedInput
  }

  export type user_assessmentsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    sectionId?: NullableStringFieldUpdateOperationsInput | string | null
    score?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_assessmentsCreateManyInput = {
    id?: string
    userId: string
    courseId: string
    sectionId?: string | null
    score: number
    type?: string
    answers: JsonNullValueInput | InputJsonValue
    durationSeconds?: number | null
    completedAt?: Date | string
  }

  export type user_assessmentsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_assessmentsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    sectionId?: NullableStringFieldUpdateOperationsInput | string | null
    score?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type course_completionsCourseIdUserIdCompoundUniqueInput = {
    courseId: string
    userId: string
  }

  export type course_completionsCountOrderByAggregateInput = {
    id?: SortOrder
    courseId?: SortOrder
    userId?: SortOrder
    percentage?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type course_completionsAvgOrderByAggregateInput = {
    percentage?: SortOrder
  }

  export type course_completionsMaxOrderByAggregateInput = {
    id?: SortOrder
    courseId?: SortOrder
    userId?: SortOrder
    percentage?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type course_completionsMinOrderByAggregateInput = {
    id?: SortOrder
    courseId?: SortOrder
    userId?: SortOrder
    percentage?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type course_completionsSumOrderByAggregateInput = {
    percentage?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumCourseStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CourseStatus | EnumCourseStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CourseStatus[] | ListEnumCourseStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CourseStatus[] | ListEnumCourseStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCourseStatusFilter<$PrismaModel> | $Enums.CourseStatus
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnrollmentsListRelationFilter = {
    every?: enrollmentsWhereInput
    some?: enrollmentsWhereInput
    none?: enrollmentsWhereInput
  }

  export type SectionsListRelationFilter = {
    every?: sectionsWhereInput
    some?: sectionsWhereInput
    none?: sectionsWhereInput
  }

  export type Assessment_questionsListRelationFilter = {
    every?: assessment_questionsWhereInput
    some?: assessment_questionsWhereInput
    none?: assessment_questionsWhereInput
  }

  export type User_assessmentsListRelationFilter = {
    every?: user_assessmentsWhereInput
    some?: user_assessmentsWhereInput
    none?: user_assessmentsWhereInput
  }

  export type enrollmentsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type sectionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type assessment_questionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type user_assessmentsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type coursesCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    description?: SortOrder
    thumbnail?: SortOrder
    status?: SortOrder
    students?: SortOrder
    lessons?: SortOrder
    duration?: SortOrder
    rating?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    creatorId?: SortOrder
    outcomes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type coursesAvgOrderByAggregateInput = {
    students?: SortOrder
    lessons?: SortOrder
    rating?: SortOrder
  }

  export type coursesMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    description?: SortOrder
    thumbnail?: SortOrder
    status?: SortOrder
    students?: SortOrder
    lessons?: SortOrder
    duration?: SortOrder
    rating?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    creatorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type coursesMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    title?: SortOrder
    description?: SortOrder
    thumbnail?: SortOrder
    status?: SortOrder
    students?: SortOrder
    lessons?: SortOrder
    duration?: SortOrder
    rating?: SortOrder
    category?: SortOrder
    difficulty?: SortOrder
    creatorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type coursesSumOrderByAggregateInput = {
    students?: SortOrder
    lessons?: SortOrder
    rating?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumCourseStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CourseStatus | EnumCourseStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CourseStatus[] | ListEnumCourseStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CourseStatus[] | ListEnumCourseStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCourseStatusWithAggregatesFilter<$PrismaModel> | $Enums.CourseStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCourseStatusFilter<$PrismaModel>
    _max?: NestedEnumCourseStatusFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type CoursesScalarRelationFilter = {
    is?: coursesWhereInput
    isNot?: coursesWhereInput
  }

  export type enrollmentsUserIdCourseIdCompoundUniqueInput = {
    userId: string
    courseId: string
  }

  export type enrollmentsCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    enrolledAt?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrder
  }

  export type enrollmentsMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    enrolledAt?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrder
  }

  export type enrollmentsMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    enrolledAt?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrder
  }

  export type LessonsScalarRelationFilter = {
    is?: lessonsWhereInput
    isNot?: lessonsWhereInput
  }

  export type lesson_progressLessonIdUserIdCompoundUniqueInput = {
    lessonId: string
    userId: string
  }

  export type lesson_progressCountOrderByAggregateInput = {
    id?: SortOrder
    lessonId?: SortOrder
    userId?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type lesson_progressMaxOrderByAggregateInput = {
    id?: SortOrder
    lessonId?: SortOrder
    userId?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type lesson_progressMinOrderByAggregateInput = {
    id?: SortOrder
    lessonId?: SortOrder
    userId?: SortOrder
    completed?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type Lesson_progressListRelationFilter = {
    every?: lesson_progressWhereInput
    some?: lesson_progressWhereInput
    none?: lesson_progressWhereInput
  }

  export type SectionsScalarRelationFilter = {
    is?: sectionsWhereInput
    isNot?: sectionsWhereInput
  }

  export type lesson_progressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type lessonsSectionIdOrderCompoundUniqueInput = {
    sectionId: string
    order: number
  }

  export type lessonsCountOrderByAggregateInput = {
    id?: SortOrder
    sectionId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type lessonsAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type lessonsMaxOrderByAggregateInput = {
    id?: SortOrder
    sectionId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type lessonsMinOrderByAggregateInput = {
    id?: SortOrder
    sectionId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type lessonsSumOrderByAggregateInput = {
    order?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type LessonsListRelationFilter = {
    every?: lessonsWhereInput
    some?: lessonsWhereInput
    none?: lessonsWhereInput
  }

  export type lessonsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type sectionsCourseIdOrderCompoundUniqueInput = {
    courseId: string
    order: number
  }

  export type sectionsCountOrderByAggregateInput = {
    id?: SortOrder
    courseId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type sectionsAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type sectionsMaxOrderByAggregateInput = {
    id?: SortOrder
    courseId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type sectionsMinOrderByAggregateInput = {
    id?: SortOrder
    courseId?: SortOrder
    order?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type sectionsSumOrderByAggregateInput = {
    order?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type creator_profilesCountOrderByAggregateInput = {
    userId?: SortOrder
    name?: SortOrder
    title?: SortOrder
    bio?: SortOrder
    experience?: SortOrder
    avatarUrl?: SortOrder
    socialLinks?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type creator_profilesMaxOrderByAggregateInput = {
    userId?: SortOrder
    name?: SortOrder
    title?: SortOrder
    bio?: SortOrder
    experience?: SortOrder
    avatarUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type creator_profilesMinOrderByAggregateInput = {
    userId?: SortOrder
    name?: SortOrder
    title?: SortOrder
    bio?: SortOrder
    experience?: SortOrder
    avatarUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type SectionsNullableScalarRelationFilter = {
    is?: sectionsWhereInput | null
    isNot?: sectionsWhereInput | null
  }

  export type assessment_questionsCountOrderByAggregateInput = {
    id?: SortOrder
    courseId?: SortOrder
    sectionId?: SortOrder
    question?: SortOrder
    options?: SortOrder
    correct?: SortOrder
    topic?: SortOrder
    difficulty?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type assessment_questionsMaxOrderByAggregateInput = {
    id?: SortOrder
    courseId?: SortOrder
    sectionId?: SortOrder
    question?: SortOrder
    correct?: SortOrder
    topic?: SortOrder
    difficulty?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type assessment_questionsMinOrderByAggregateInput = {
    id?: SortOrder
    courseId?: SortOrder
    sectionId?: SortOrder
    question?: SortOrder
    correct?: SortOrder
    topic?: SortOrder
    difficulty?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type user_assessmentsUserIdCourseIdSectionIdTypeCompoundUniqueInput = {
    userId: string
    courseId: string
    sectionId: string
    type: string
  }

  export type user_assessmentsCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    sectionId?: SortOrder
    score?: SortOrder
    type?: SortOrder
    answers?: SortOrder
    durationSeconds?: SortOrder
    completedAt?: SortOrder
  }

  export type user_assessmentsAvgOrderByAggregateInput = {
    score?: SortOrder
    durationSeconds?: SortOrder
  }

  export type user_assessmentsMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    sectionId?: SortOrder
    score?: SortOrder
    type?: SortOrder
    durationSeconds?: SortOrder
    completedAt?: SortOrder
  }

  export type user_assessmentsMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    courseId?: SortOrder
    sectionId?: SortOrder
    score?: SortOrder
    type?: SortOrder
    durationSeconds?: SortOrder
    completedAt?: SortOrder
  }

  export type user_assessmentsSumOrderByAggregateInput = {
    score?: SortOrder
    durationSeconds?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type coursesCreateoutcomesInput = {
    set: string[]
  }

  export type enrollmentsCreateNestedManyWithoutCoursesInput = {
    create?: XOR<enrollmentsCreateWithoutCoursesInput, enrollmentsUncheckedCreateWithoutCoursesInput> | enrollmentsCreateWithoutCoursesInput[] | enrollmentsUncheckedCreateWithoutCoursesInput[]
    connectOrCreate?: enrollmentsCreateOrConnectWithoutCoursesInput | enrollmentsCreateOrConnectWithoutCoursesInput[]
    createMany?: enrollmentsCreateManyCoursesInputEnvelope
    connect?: enrollmentsWhereUniqueInput | enrollmentsWhereUniqueInput[]
  }

  export type sectionsCreateNestedManyWithoutCoursesInput = {
    create?: XOR<sectionsCreateWithoutCoursesInput, sectionsUncheckedCreateWithoutCoursesInput> | sectionsCreateWithoutCoursesInput[] | sectionsUncheckedCreateWithoutCoursesInput[]
    connectOrCreate?: sectionsCreateOrConnectWithoutCoursesInput | sectionsCreateOrConnectWithoutCoursesInput[]
    createMany?: sectionsCreateManyCoursesInputEnvelope
    connect?: sectionsWhereUniqueInput | sectionsWhereUniqueInput[]
  }

  export type assessment_questionsCreateNestedManyWithoutCoursesInput = {
    create?: XOR<assessment_questionsCreateWithoutCoursesInput, assessment_questionsUncheckedCreateWithoutCoursesInput> | assessment_questionsCreateWithoutCoursesInput[] | assessment_questionsUncheckedCreateWithoutCoursesInput[]
    connectOrCreate?: assessment_questionsCreateOrConnectWithoutCoursesInput | assessment_questionsCreateOrConnectWithoutCoursesInput[]
    createMany?: assessment_questionsCreateManyCoursesInputEnvelope
    connect?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
  }

  export type user_assessmentsCreateNestedManyWithoutCoursesInput = {
    create?: XOR<user_assessmentsCreateWithoutCoursesInput, user_assessmentsUncheckedCreateWithoutCoursesInput> | user_assessmentsCreateWithoutCoursesInput[] | user_assessmentsUncheckedCreateWithoutCoursesInput[]
    connectOrCreate?: user_assessmentsCreateOrConnectWithoutCoursesInput | user_assessmentsCreateOrConnectWithoutCoursesInput[]
    createMany?: user_assessmentsCreateManyCoursesInputEnvelope
    connect?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
  }

  export type enrollmentsUncheckedCreateNestedManyWithoutCoursesInput = {
    create?: XOR<enrollmentsCreateWithoutCoursesInput, enrollmentsUncheckedCreateWithoutCoursesInput> | enrollmentsCreateWithoutCoursesInput[] | enrollmentsUncheckedCreateWithoutCoursesInput[]
    connectOrCreate?: enrollmentsCreateOrConnectWithoutCoursesInput | enrollmentsCreateOrConnectWithoutCoursesInput[]
    createMany?: enrollmentsCreateManyCoursesInputEnvelope
    connect?: enrollmentsWhereUniqueInput | enrollmentsWhereUniqueInput[]
  }

  export type sectionsUncheckedCreateNestedManyWithoutCoursesInput = {
    create?: XOR<sectionsCreateWithoutCoursesInput, sectionsUncheckedCreateWithoutCoursesInput> | sectionsCreateWithoutCoursesInput[] | sectionsUncheckedCreateWithoutCoursesInput[]
    connectOrCreate?: sectionsCreateOrConnectWithoutCoursesInput | sectionsCreateOrConnectWithoutCoursesInput[]
    createMany?: sectionsCreateManyCoursesInputEnvelope
    connect?: sectionsWhereUniqueInput | sectionsWhereUniqueInput[]
  }

  export type assessment_questionsUncheckedCreateNestedManyWithoutCoursesInput = {
    create?: XOR<assessment_questionsCreateWithoutCoursesInput, assessment_questionsUncheckedCreateWithoutCoursesInput> | assessment_questionsCreateWithoutCoursesInput[] | assessment_questionsUncheckedCreateWithoutCoursesInput[]
    connectOrCreate?: assessment_questionsCreateOrConnectWithoutCoursesInput | assessment_questionsCreateOrConnectWithoutCoursesInput[]
    createMany?: assessment_questionsCreateManyCoursesInputEnvelope
    connect?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
  }

  export type user_assessmentsUncheckedCreateNestedManyWithoutCoursesInput = {
    create?: XOR<user_assessmentsCreateWithoutCoursesInput, user_assessmentsUncheckedCreateWithoutCoursesInput> | user_assessmentsCreateWithoutCoursesInput[] | user_assessmentsUncheckedCreateWithoutCoursesInput[]
    connectOrCreate?: user_assessmentsCreateOrConnectWithoutCoursesInput | user_assessmentsCreateOrConnectWithoutCoursesInput[]
    createMany?: user_assessmentsCreateManyCoursesInputEnvelope
    connect?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumCourseStatusFieldUpdateOperationsInput = {
    set?: $Enums.CourseStatus
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type coursesUpdateoutcomesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type enrollmentsUpdateManyWithoutCoursesNestedInput = {
    create?: XOR<enrollmentsCreateWithoutCoursesInput, enrollmentsUncheckedCreateWithoutCoursesInput> | enrollmentsCreateWithoutCoursesInput[] | enrollmentsUncheckedCreateWithoutCoursesInput[]
    connectOrCreate?: enrollmentsCreateOrConnectWithoutCoursesInput | enrollmentsCreateOrConnectWithoutCoursesInput[]
    upsert?: enrollmentsUpsertWithWhereUniqueWithoutCoursesInput | enrollmentsUpsertWithWhereUniqueWithoutCoursesInput[]
    createMany?: enrollmentsCreateManyCoursesInputEnvelope
    set?: enrollmentsWhereUniqueInput | enrollmentsWhereUniqueInput[]
    disconnect?: enrollmentsWhereUniqueInput | enrollmentsWhereUniqueInput[]
    delete?: enrollmentsWhereUniqueInput | enrollmentsWhereUniqueInput[]
    connect?: enrollmentsWhereUniqueInput | enrollmentsWhereUniqueInput[]
    update?: enrollmentsUpdateWithWhereUniqueWithoutCoursesInput | enrollmentsUpdateWithWhereUniqueWithoutCoursesInput[]
    updateMany?: enrollmentsUpdateManyWithWhereWithoutCoursesInput | enrollmentsUpdateManyWithWhereWithoutCoursesInput[]
    deleteMany?: enrollmentsScalarWhereInput | enrollmentsScalarWhereInput[]
  }

  export type sectionsUpdateManyWithoutCoursesNestedInput = {
    create?: XOR<sectionsCreateWithoutCoursesInput, sectionsUncheckedCreateWithoutCoursesInput> | sectionsCreateWithoutCoursesInput[] | sectionsUncheckedCreateWithoutCoursesInput[]
    connectOrCreate?: sectionsCreateOrConnectWithoutCoursesInput | sectionsCreateOrConnectWithoutCoursesInput[]
    upsert?: sectionsUpsertWithWhereUniqueWithoutCoursesInput | sectionsUpsertWithWhereUniqueWithoutCoursesInput[]
    createMany?: sectionsCreateManyCoursesInputEnvelope
    set?: sectionsWhereUniqueInput | sectionsWhereUniqueInput[]
    disconnect?: sectionsWhereUniqueInput | sectionsWhereUniqueInput[]
    delete?: sectionsWhereUniqueInput | sectionsWhereUniqueInput[]
    connect?: sectionsWhereUniqueInput | sectionsWhereUniqueInput[]
    update?: sectionsUpdateWithWhereUniqueWithoutCoursesInput | sectionsUpdateWithWhereUniqueWithoutCoursesInput[]
    updateMany?: sectionsUpdateManyWithWhereWithoutCoursesInput | sectionsUpdateManyWithWhereWithoutCoursesInput[]
    deleteMany?: sectionsScalarWhereInput | sectionsScalarWhereInput[]
  }

  export type assessment_questionsUpdateManyWithoutCoursesNestedInput = {
    create?: XOR<assessment_questionsCreateWithoutCoursesInput, assessment_questionsUncheckedCreateWithoutCoursesInput> | assessment_questionsCreateWithoutCoursesInput[] | assessment_questionsUncheckedCreateWithoutCoursesInput[]
    connectOrCreate?: assessment_questionsCreateOrConnectWithoutCoursesInput | assessment_questionsCreateOrConnectWithoutCoursesInput[]
    upsert?: assessment_questionsUpsertWithWhereUniqueWithoutCoursesInput | assessment_questionsUpsertWithWhereUniqueWithoutCoursesInput[]
    createMany?: assessment_questionsCreateManyCoursesInputEnvelope
    set?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
    disconnect?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
    delete?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
    connect?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
    update?: assessment_questionsUpdateWithWhereUniqueWithoutCoursesInput | assessment_questionsUpdateWithWhereUniqueWithoutCoursesInput[]
    updateMany?: assessment_questionsUpdateManyWithWhereWithoutCoursesInput | assessment_questionsUpdateManyWithWhereWithoutCoursesInput[]
    deleteMany?: assessment_questionsScalarWhereInput | assessment_questionsScalarWhereInput[]
  }

  export type user_assessmentsUpdateManyWithoutCoursesNestedInput = {
    create?: XOR<user_assessmentsCreateWithoutCoursesInput, user_assessmentsUncheckedCreateWithoutCoursesInput> | user_assessmentsCreateWithoutCoursesInput[] | user_assessmentsUncheckedCreateWithoutCoursesInput[]
    connectOrCreate?: user_assessmentsCreateOrConnectWithoutCoursesInput | user_assessmentsCreateOrConnectWithoutCoursesInput[]
    upsert?: user_assessmentsUpsertWithWhereUniqueWithoutCoursesInput | user_assessmentsUpsertWithWhereUniqueWithoutCoursesInput[]
    createMany?: user_assessmentsCreateManyCoursesInputEnvelope
    set?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
    disconnect?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
    delete?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
    connect?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
    update?: user_assessmentsUpdateWithWhereUniqueWithoutCoursesInput | user_assessmentsUpdateWithWhereUniqueWithoutCoursesInput[]
    updateMany?: user_assessmentsUpdateManyWithWhereWithoutCoursesInput | user_assessmentsUpdateManyWithWhereWithoutCoursesInput[]
    deleteMany?: user_assessmentsScalarWhereInput | user_assessmentsScalarWhereInput[]
  }

  export type enrollmentsUncheckedUpdateManyWithoutCoursesNestedInput = {
    create?: XOR<enrollmentsCreateWithoutCoursesInput, enrollmentsUncheckedCreateWithoutCoursesInput> | enrollmentsCreateWithoutCoursesInput[] | enrollmentsUncheckedCreateWithoutCoursesInput[]
    connectOrCreate?: enrollmentsCreateOrConnectWithoutCoursesInput | enrollmentsCreateOrConnectWithoutCoursesInput[]
    upsert?: enrollmentsUpsertWithWhereUniqueWithoutCoursesInput | enrollmentsUpsertWithWhereUniqueWithoutCoursesInput[]
    createMany?: enrollmentsCreateManyCoursesInputEnvelope
    set?: enrollmentsWhereUniqueInput | enrollmentsWhereUniqueInput[]
    disconnect?: enrollmentsWhereUniqueInput | enrollmentsWhereUniqueInput[]
    delete?: enrollmentsWhereUniqueInput | enrollmentsWhereUniqueInput[]
    connect?: enrollmentsWhereUniqueInput | enrollmentsWhereUniqueInput[]
    update?: enrollmentsUpdateWithWhereUniqueWithoutCoursesInput | enrollmentsUpdateWithWhereUniqueWithoutCoursesInput[]
    updateMany?: enrollmentsUpdateManyWithWhereWithoutCoursesInput | enrollmentsUpdateManyWithWhereWithoutCoursesInput[]
    deleteMany?: enrollmentsScalarWhereInput | enrollmentsScalarWhereInput[]
  }

  export type sectionsUncheckedUpdateManyWithoutCoursesNestedInput = {
    create?: XOR<sectionsCreateWithoutCoursesInput, sectionsUncheckedCreateWithoutCoursesInput> | sectionsCreateWithoutCoursesInput[] | sectionsUncheckedCreateWithoutCoursesInput[]
    connectOrCreate?: sectionsCreateOrConnectWithoutCoursesInput | sectionsCreateOrConnectWithoutCoursesInput[]
    upsert?: sectionsUpsertWithWhereUniqueWithoutCoursesInput | sectionsUpsertWithWhereUniqueWithoutCoursesInput[]
    createMany?: sectionsCreateManyCoursesInputEnvelope
    set?: sectionsWhereUniqueInput | sectionsWhereUniqueInput[]
    disconnect?: sectionsWhereUniqueInput | sectionsWhereUniqueInput[]
    delete?: sectionsWhereUniqueInput | sectionsWhereUniqueInput[]
    connect?: sectionsWhereUniqueInput | sectionsWhereUniqueInput[]
    update?: sectionsUpdateWithWhereUniqueWithoutCoursesInput | sectionsUpdateWithWhereUniqueWithoutCoursesInput[]
    updateMany?: sectionsUpdateManyWithWhereWithoutCoursesInput | sectionsUpdateManyWithWhereWithoutCoursesInput[]
    deleteMany?: sectionsScalarWhereInput | sectionsScalarWhereInput[]
  }

  export type assessment_questionsUncheckedUpdateManyWithoutCoursesNestedInput = {
    create?: XOR<assessment_questionsCreateWithoutCoursesInput, assessment_questionsUncheckedCreateWithoutCoursesInput> | assessment_questionsCreateWithoutCoursesInput[] | assessment_questionsUncheckedCreateWithoutCoursesInput[]
    connectOrCreate?: assessment_questionsCreateOrConnectWithoutCoursesInput | assessment_questionsCreateOrConnectWithoutCoursesInput[]
    upsert?: assessment_questionsUpsertWithWhereUniqueWithoutCoursesInput | assessment_questionsUpsertWithWhereUniqueWithoutCoursesInput[]
    createMany?: assessment_questionsCreateManyCoursesInputEnvelope
    set?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
    disconnect?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
    delete?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
    connect?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
    update?: assessment_questionsUpdateWithWhereUniqueWithoutCoursesInput | assessment_questionsUpdateWithWhereUniqueWithoutCoursesInput[]
    updateMany?: assessment_questionsUpdateManyWithWhereWithoutCoursesInput | assessment_questionsUpdateManyWithWhereWithoutCoursesInput[]
    deleteMany?: assessment_questionsScalarWhereInput | assessment_questionsScalarWhereInput[]
  }

  export type user_assessmentsUncheckedUpdateManyWithoutCoursesNestedInput = {
    create?: XOR<user_assessmentsCreateWithoutCoursesInput, user_assessmentsUncheckedCreateWithoutCoursesInput> | user_assessmentsCreateWithoutCoursesInput[] | user_assessmentsUncheckedCreateWithoutCoursesInput[]
    connectOrCreate?: user_assessmentsCreateOrConnectWithoutCoursesInput | user_assessmentsCreateOrConnectWithoutCoursesInput[]
    upsert?: user_assessmentsUpsertWithWhereUniqueWithoutCoursesInput | user_assessmentsUpsertWithWhereUniqueWithoutCoursesInput[]
    createMany?: user_assessmentsCreateManyCoursesInputEnvelope
    set?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
    disconnect?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
    delete?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
    connect?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
    update?: user_assessmentsUpdateWithWhereUniqueWithoutCoursesInput | user_assessmentsUpdateWithWhereUniqueWithoutCoursesInput[]
    updateMany?: user_assessmentsUpdateManyWithWhereWithoutCoursesInput | user_assessmentsUpdateManyWithWhereWithoutCoursesInput[]
    deleteMany?: user_assessmentsScalarWhereInput | user_assessmentsScalarWhereInput[]
  }

  export type coursesCreateNestedOneWithoutEnrollmentsInput = {
    create?: XOR<coursesCreateWithoutEnrollmentsInput, coursesUncheckedCreateWithoutEnrollmentsInput>
    connectOrCreate?: coursesCreateOrConnectWithoutEnrollmentsInput
    connect?: coursesWhereUniqueInput
  }

  export type coursesUpdateOneRequiredWithoutEnrollmentsNestedInput = {
    create?: XOR<coursesCreateWithoutEnrollmentsInput, coursesUncheckedCreateWithoutEnrollmentsInput>
    connectOrCreate?: coursesCreateOrConnectWithoutEnrollmentsInput
    upsert?: coursesUpsertWithoutEnrollmentsInput
    connect?: coursesWhereUniqueInput
    update?: XOR<XOR<coursesUpdateToOneWithWhereWithoutEnrollmentsInput, coursesUpdateWithoutEnrollmentsInput>, coursesUncheckedUpdateWithoutEnrollmentsInput>
  }

  export type lessonsCreateNestedOneWithoutLesson_progressInput = {
    create?: XOR<lessonsCreateWithoutLesson_progressInput, lessonsUncheckedCreateWithoutLesson_progressInput>
    connectOrCreate?: lessonsCreateOrConnectWithoutLesson_progressInput
    connect?: lessonsWhereUniqueInput
  }

  export type lessonsUpdateOneRequiredWithoutLesson_progressNestedInput = {
    create?: XOR<lessonsCreateWithoutLesson_progressInput, lessonsUncheckedCreateWithoutLesson_progressInput>
    connectOrCreate?: lessonsCreateOrConnectWithoutLesson_progressInput
    upsert?: lessonsUpsertWithoutLesson_progressInput
    connect?: lessonsWhereUniqueInput
    update?: XOR<XOR<lessonsUpdateToOneWithWhereWithoutLesson_progressInput, lessonsUpdateWithoutLesson_progressInput>, lessonsUncheckedUpdateWithoutLesson_progressInput>
  }

  export type lesson_progressCreateNestedManyWithoutLessonsInput = {
    create?: XOR<lesson_progressCreateWithoutLessonsInput, lesson_progressUncheckedCreateWithoutLessonsInput> | lesson_progressCreateWithoutLessonsInput[] | lesson_progressUncheckedCreateWithoutLessonsInput[]
    connectOrCreate?: lesson_progressCreateOrConnectWithoutLessonsInput | lesson_progressCreateOrConnectWithoutLessonsInput[]
    createMany?: lesson_progressCreateManyLessonsInputEnvelope
    connect?: lesson_progressWhereUniqueInput | lesson_progressWhereUniqueInput[]
  }

  export type sectionsCreateNestedOneWithoutLessonsInput = {
    create?: XOR<sectionsCreateWithoutLessonsInput, sectionsUncheckedCreateWithoutLessonsInput>
    connectOrCreate?: sectionsCreateOrConnectWithoutLessonsInput
    connect?: sectionsWhereUniqueInput
  }

  export type lesson_progressUncheckedCreateNestedManyWithoutLessonsInput = {
    create?: XOR<lesson_progressCreateWithoutLessonsInput, lesson_progressUncheckedCreateWithoutLessonsInput> | lesson_progressCreateWithoutLessonsInput[] | lesson_progressUncheckedCreateWithoutLessonsInput[]
    connectOrCreate?: lesson_progressCreateOrConnectWithoutLessonsInput | lesson_progressCreateOrConnectWithoutLessonsInput[]
    createMany?: lesson_progressCreateManyLessonsInputEnvelope
    connect?: lesson_progressWhereUniqueInput | lesson_progressWhereUniqueInput[]
  }

  export type lesson_progressUpdateManyWithoutLessonsNestedInput = {
    create?: XOR<lesson_progressCreateWithoutLessonsInput, lesson_progressUncheckedCreateWithoutLessonsInput> | lesson_progressCreateWithoutLessonsInput[] | lesson_progressUncheckedCreateWithoutLessonsInput[]
    connectOrCreate?: lesson_progressCreateOrConnectWithoutLessonsInput | lesson_progressCreateOrConnectWithoutLessonsInput[]
    upsert?: lesson_progressUpsertWithWhereUniqueWithoutLessonsInput | lesson_progressUpsertWithWhereUniqueWithoutLessonsInput[]
    createMany?: lesson_progressCreateManyLessonsInputEnvelope
    set?: lesson_progressWhereUniqueInput | lesson_progressWhereUniqueInput[]
    disconnect?: lesson_progressWhereUniqueInput | lesson_progressWhereUniqueInput[]
    delete?: lesson_progressWhereUniqueInput | lesson_progressWhereUniqueInput[]
    connect?: lesson_progressWhereUniqueInput | lesson_progressWhereUniqueInput[]
    update?: lesson_progressUpdateWithWhereUniqueWithoutLessonsInput | lesson_progressUpdateWithWhereUniqueWithoutLessonsInput[]
    updateMany?: lesson_progressUpdateManyWithWhereWithoutLessonsInput | lesson_progressUpdateManyWithWhereWithoutLessonsInput[]
    deleteMany?: lesson_progressScalarWhereInput | lesson_progressScalarWhereInput[]
  }

  export type sectionsUpdateOneRequiredWithoutLessonsNestedInput = {
    create?: XOR<sectionsCreateWithoutLessonsInput, sectionsUncheckedCreateWithoutLessonsInput>
    connectOrCreate?: sectionsCreateOrConnectWithoutLessonsInput
    upsert?: sectionsUpsertWithoutLessonsInput
    connect?: sectionsWhereUniqueInput
    update?: XOR<XOR<sectionsUpdateToOneWithWhereWithoutLessonsInput, sectionsUpdateWithoutLessonsInput>, sectionsUncheckedUpdateWithoutLessonsInput>
  }

  export type lesson_progressUncheckedUpdateManyWithoutLessonsNestedInput = {
    create?: XOR<lesson_progressCreateWithoutLessonsInput, lesson_progressUncheckedCreateWithoutLessonsInput> | lesson_progressCreateWithoutLessonsInput[] | lesson_progressUncheckedCreateWithoutLessonsInput[]
    connectOrCreate?: lesson_progressCreateOrConnectWithoutLessonsInput | lesson_progressCreateOrConnectWithoutLessonsInput[]
    upsert?: lesson_progressUpsertWithWhereUniqueWithoutLessonsInput | lesson_progressUpsertWithWhereUniqueWithoutLessonsInput[]
    createMany?: lesson_progressCreateManyLessonsInputEnvelope
    set?: lesson_progressWhereUniqueInput | lesson_progressWhereUniqueInput[]
    disconnect?: lesson_progressWhereUniqueInput | lesson_progressWhereUniqueInput[]
    delete?: lesson_progressWhereUniqueInput | lesson_progressWhereUniqueInput[]
    connect?: lesson_progressWhereUniqueInput | lesson_progressWhereUniqueInput[]
    update?: lesson_progressUpdateWithWhereUniqueWithoutLessonsInput | lesson_progressUpdateWithWhereUniqueWithoutLessonsInput[]
    updateMany?: lesson_progressUpdateManyWithWhereWithoutLessonsInput | lesson_progressUpdateManyWithWhereWithoutLessonsInput[]
    deleteMany?: lesson_progressScalarWhereInput | lesson_progressScalarWhereInput[]
  }

  export type lessonsCreateNestedManyWithoutSectionsInput = {
    create?: XOR<lessonsCreateWithoutSectionsInput, lessonsUncheckedCreateWithoutSectionsInput> | lessonsCreateWithoutSectionsInput[] | lessonsUncheckedCreateWithoutSectionsInput[]
    connectOrCreate?: lessonsCreateOrConnectWithoutSectionsInput | lessonsCreateOrConnectWithoutSectionsInput[]
    createMany?: lessonsCreateManySectionsInputEnvelope
    connect?: lessonsWhereUniqueInput | lessonsWhereUniqueInput[]
  }

  export type coursesCreateNestedOneWithoutSectionsInput = {
    create?: XOR<coursesCreateWithoutSectionsInput, coursesUncheckedCreateWithoutSectionsInput>
    connectOrCreate?: coursesCreateOrConnectWithoutSectionsInput
    connect?: coursesWhereUniqueInput
  }

  export type assessment_questionsCreateNestedManyWithoutSectionsInput = {
    create?: XOR<assessment_questionsCreateWithoutSectionsInput, assessment_questionsUncheckedCreateWithoutSectionsInput> | assessment_questionsCreateWithoutSectionsInput[] | assessment_questionsUncheckedCreateWithoutSectionsInput[]
    connectOrCreate?: assessment_questionsCreateOrConnectWithoutSectionsInput | assessment_questionsCreateOrConnectWithoutSectionsInput[]
    createMany?: assessment_questionsCreateManySectionsInputEnvelope
    connect?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
  }

  export type user_assessmentsCreateNestedManyWithoutSectionsInput = {
    create?: XOR<user_assessmentsCreateWithoutSectionsInput, user_assessmentsUncheckedCreateWithoutSectionsInput> | user_assessmentsCreateWithoutSectionsInput[] | user_assessmentsUncheckedCreateWithoutSectionsInput[]
    connectOrCreate?: user_assessmentsCreateOrConnectWithoutSectionsInput | user_assessmentsCreateOrConnectWithoutSectionsInput[]
    createMany?: user_assessmentsCreateManySectionsInputEnvelope
    connect?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
  }

  export type lessonsUncheckedCreateNestedManyWithoutSectionsInput = {
    create?: XOR<lessonsCreateWithoutSectionsInput, lessonsUncheckedCreateWithoutSectionsInput> | lessonsCreateWithoutSectionsInput[] | lessonsUncheckedCreateWithoutSectionsInput[]
    connectOrCreate?: lessonsCreateOrConnectWithoutSectionsInput | lessonsCreateOrConnectWithoutSectionsInput[]
    createMany?: lessonsCreateManySectionsInputEnvelope
    connect?: lessonsWhereUniqueInput | lessonsWhereUniqueInput[]
  }

  export type assessment_questionsUncheckedCreateNestedManyWithoutSectionsInput = {
    create?: XOR<assessment_questionsCreateWithoutSectionsInput, assessment_questionsUncheckedCreateWithoutSectionsInput> | assessment_questionsCreateWithoutSectionsInput[] | assessment_questionsUncheckedCreateWithoutSectionsInput[]
    connectOrCreate?: assessment_questionsCreateOrConnectWithoutSectionsInput | assessment_questionsCreateOrConnectWithoutSectionsInput[]
    createMany?: assessment_questionsCreateManySectionsInputEnvelope
    connect?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
  }

  export type user_assessmentsUncheckedCreateNestedManyWithoutSectionsInput = {
    create?: XOR<user_assessmentsCreateWithoutSectionsInput, user_assessmentsUncheckedCreateWithoutSectionsInput> | user_assessmentsCreateWithoutSectionsInput[] | user_assessmentsUncheckedCreateWithoutSectionsInput[]
    connectOrCreate?: user_assessmentsCreateOrConnectWithoutSectionsInput | user_assessmentsCreateOrConnectWithoutSectionsInput[]
    createMany?: user_assessmentsCreateManySectionsInputEnvelope
    connect?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
  }

  export type lessonsUpdateManyWithoutSectionsNestedInput = {
    create?: XOR<lessonsCreateWithoutSectionsInput, lessonsUncheckedCreateWithoutSectionsInput> | lessonsCreateWithoutSectionsInput[] | lessonsUncheckedCreateWithoutSectionsInput[]
    connectOrCreate?: lessonsCreateOrConnectWithoutSectionsInput | lessonsCreateOrConnectWithoutSectionsInput[]
    upsert?: lessonsUpsertWithWhereUniqueWithoutSectionsInput | lessonsUpsertWithWhereUniqueWithoutSectionsInput[]
    createMany?: lessonsCreateManySectionsInputEnvelope
    set?: lessonsWhereUniqueInput | lessonsWhereUniqueInput[]
    disconnect?: lessonsWhereUniqueInput | lessonsWhereUniqueInput[]
    delete?: lessonsWhereUniqueInput | lessonsWhereUniqueInput[]
    connect?: lessonsWhereUniqueInput | lessonsWhereUniqueInput[]
    update?: lessonsUpdateWithWhereUniqueWithoutSectionsInput | lessonsUpdateWithWhereUniqueWithoutSectionsInput[]
    updateMany?: lessonsUpdateManyWithWhereWithoutSectionsInput | lessonsUpdateManyWithWhereWithoutSectionsInput[]
    deleteMany?: lessonsScalarWhereInput | lessonsScalarWhereInput[]
  }

  export type coursesUpdateOneRequiredWithoutSectionsNestedInput = {
    create?: XOR<coursesCreateWithoutSectionsInput, coursesUncheckedCreateWithoutSectionsInput>
    connectOrCreate?: coursesCreateOrConnectWithoutSectionsInput
    upsert?: coursesUpsertWithoutSectionsInput
    connect?: coursesWhereUniqueInput
    update?: XOR<XOR<coursesUpdateToOneWithWhereWithoutSectionsInput, coursesUpdateWithoutSectionsInput>, coursesUncheckedUpdateWithoutSectionsInput>
  }

  export type assessment_questionsUpdateManyWithoutSectionsNestedInput = {
    create?: XOR<assessment_questionsCreateWithoutSectionsInput, assessment_questionsUncheckedCreateWithoutSectionsInput> | assessment_questionsCreateWithoutSectionsInput[] | assessment_questionsUncheckedCreateWithoutSectionsInput[]
    connectOrCreate?: assessment_questionsCreateOrConnectWithoutSectionsInput | assessment_questionsCreateOrConnectWithoutSectionsInput[]
    upsert?: assessment_questionsUpsertWithWhereUniqueWithoutSectionsInput | assessment_questionsUpsertWithWhereUniqueWithoutSectionsInput[]
    createMany?: assessment_questionsCreateManySectionsInputEnvelope
    set?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
    disconnect?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
    delete?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
    connect?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
    update?: assessment_questionsUpdateWithWhereUniqueWithoutSectionsInput | assessment_questionsUpdateWithWhereUniqueWithoutSectionsInput[]
    updateMany?: assessment_questionsUpdateManyWithWhereWithoutSectionsInput | assessment_questionsUpdateManyWithWhereWithoutSectionsInput[]
    deleteMany?: assessment_questionsScalarWhereInput | assessment_questionsScalarWhereInput[]
  }

  export type user_assessmentsUpdateManyWithoutSectionsNestedInput = {
    create?: XOR<user_assessmentsCreateWithoutSectionsInput, user_assessmentsUncheckedCreateWithoutSectionsInput> | user_assessmentsCreateWithoutSectionsInput[] | user_assessmentsUncheckedCreateWithoutSectionsInput[]
    connectOrCreate?: user_assessmentsCreateOrConnectWithoutSectionsInput | user_assessmentsCreateOrConnectWithoutSectionsInput[]
    upsert?: user_assessmentsUpsertWithWhereUniqueWithoutSectionsInput | user_assessmentsUpsertWithWhereUniqueWithoutSectionsInput[]
    createMany?: user_assessmentsCreateManySectionsInputEnvelope
    set?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
    disconnect?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
    delete?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
    connect?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
    update?: user_assessmentsUpdateWithWhereUniqueWithoutSectionsInput | user_assessmentsUpdateWithWhereUniqueWithoutSectionsInput[]
    updateMany?: user_assessmentsUpdateManyWithWhereWithoutSectionsInput | user_assessmentsUpdateManyWithWhereWithoutSectionsInput[]
    deleteMany?: user_assessmentsScalarWhereInput | user_assessmentsScalarWhereInput[]
  }

  export type lessonsUncheckedUpdateManyWithoutSectionsNestedInput = {
    create?: XOR<lessonsCreateWithoutSectionsInput, lessonsUncheckedCreateWithoutSectionsInput> | lessonsCreateWithoutSectionsInput[] | lessonsUncheckedCreateWithoutSectionsInput[]
    connectOrCreate?: lessonsCreateOrConnectWithoutSectionsInput | lessonsCreateOrConnectWithoutSectionsInput[]
    upsert?: lessonsUpsertWithWhereUniqueWithoutSectionsInput | lessonsUpsertWithWhereUniqueWithoutSectionsInput[]
    createMany?: lessonsCreateManySectionsInputEnvelope
    set?: lessonsWhereUniqueInput | lessonsWhereUniqueInput[]
    disconnect?: lessonsWhereUniqueInput | lessonsWhereUniqueInput[]
    delete?: lessonsWhereUniqueInput | lessonsWhereUniqueInput[]
    connect?: lessonsWhereUniqueInput | lessonsWhereUniqueInput[]
    update?: lessonsUpdateWithWhereUniqueWithoutSectionsInput | lessonsUpdateWithWhereUniqueWithoutSectionsInput[]
    updateMany?: lessonsUpdateManyWithWhereWithoutSectionsInput | lessonsUpdateManyWithWhereWithoutSectionsInput[]
    deleteMany?: lessonsScalarWhereInput | lessonsScalarWhereInput[]
  }

  export type assessment_questionsUncheckedUpdateManyWithoutSectionsNestedInput = {
    create?: XOR<assessment_questionsCreateWithoutSectionsInput, assessment_questionsUncheckedCreateWithoutSectionsInput> | assessment_questionsCreateWithoutSectionsInput[] | assessment_questionsUncheckedCreateWithoutSectionsInput[]
    connectOrCreate?: assessment_questionsCreateOrConnectWithoutSectionsInput | assessment_questionsCreateOrConnectWithoutSectionsInput[]
    upsert?: assessment_questionsUpsertWithWhereUniqueWithoutSectionsInput | assessment_questionsUpsertWithWhereUniqueWithoutSectionsInput[]
    createMany?: assessment_questionsCreateManySectionsInputEnvelope
    set?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
    disconnect?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
    delete?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
    connect?: assessment_questionsWhereUniqueInput | assessment_questionsWhereUniqueInput[]
    update?: assessment_questionsUpdateWithWhereUniqueWithoutSectionsInput | assessment_questionsUpdateWithWhereUniqueWithoutSectionsInput[]
    updateMany?: assessment_questionsUpdateManyWithWhereWithoutSectionsInput | assessment_questionsUpdateManyWithWhereWithoutSectionsInput[]
    deleteMany?: assessment_questionsScalarWhereInput | assessment_questionsScalarWhereInput[]
  }

  export type user_assessmentsUncheckedUpdateManyWithoutSectionsNestedInput = {
    create?: XOR<user_assessmentsCreateWithoutSectionsInput, user_assessmentsUncheckedCreateWithoutSectionsInput> | user_assessmentsCreateWithoutSectionsInput[] | user_assessmentsUncheckedCreateWithoutSectionsInput[]
    connectOrCreate?: user_assessmentsCreateOrConnectWithoutSectionsInput | user_assessmentsCreateOrConnectWithoutSectionsInput[]
    upsert?: user_assessmentsUpsertWithWhereUniqueWithoutSectionsInput | user_assessmentsUpsertWithWhereUniqueWithoutSectionsInput[]
    createMany?: user_assessmentsCreateManySectionsInputEnvelope
    set?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
    disconnect?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
    delete?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
    connect?: user_assessmentsWhereUniqueInput | user_assessmentsWhereUniqueInput[]
    update?: user_assessmentsUpdateWithWhereUniqueWithoutSectionsInput | user_assessmentsUpdateWithWhereUniqueWithoutSectionsInput[]
    updateMany?: user_assessmentsUpdateManyWithWhereWithoutSectionsInput | user_assessmentsUpdateManyWithWhereWithoutSectionsInput[]
    deleteMany?: user_assessmentsScalarWhereInput | user_assessmentsScalarWhereInput[]
  }

  export type coursesCreateNestedOneWithoutAssessment_questionsInput = {
    create?: XOR<coursesCreateWithoutAssessment_questionsInput, coursesUncheckedCreateWithoutAssessment_questionsInput>
    connectOrCreate?: coursesCreateOrConnectWithoutAssessment_questionsInput
    connect?: coursesWhereUniqueInput
  }

  export type sectionsCreateNestedOneWithoutAssessment_questionsInput = {
    create?: XOR<sectionsCreateWithoutAssessment_questionsInput, sectionsUncheckedCreateWithoutAssessment_questionsInput>
    connectOrCreate?: sectionsCreateOrConnectWithoutAssessment_questionsInput
    connect?: sectionsWhereUniqueInput
  }

  export type coursesUpdateOneRequiredWithoutAssessment_questionsNestedInput = {
    create?: XOR<coursesCreateWithoutAssessment_questionsInput, coursesUncheckedCreateWithoutAssessment_questionsInput>
    connectOrCreate?: coursesCreateOrConnectWithoutAssessment_questionsInput
    upsert?: coursesUpsertWithoutAssessment_questionsInput
    connect?: coursesWhereUniqueInput
    update?: XOR<XOR<coursesUpdateToOneWithWhereWithoutAssessment_questionsInput, coursesUpdateWithoutAssessment_questionsInput>, coursesUncheckedUpdateWithoutAssessment_questionsInput>
  }

  export type sectionsUpdateOneWithoutAssessment_questionsNestedInput = {
    create?: XOR<sectionsCreateWithoutAssessment_questionsInput, sectionsUncheckedCreateWithoutAssessment_questionsInput>
    connectOrCreate?: sectionsCreateOrConnectWithoutAssessment_questionsInput
    upsert?: sectionsUpsertWithoutAssessment_questionsInput
    disconnect?: sectionsWhereInput | boolean
    delete?: sectionsWhereInput | boolean
    connect?: sectionsWhereUniqueInput
    update?: XOR<XOR<sectionsUpdateToOneWithWhereWithoutAssessment_questionsInput, sectionsUpdateWithoutAssessment_questionsInput>, sectionsUncheckedUpdateWithoutAssessment_questionsInput>
  }

  export type coursesCreateNestedOneWithoutUser_assessmentsInput = {
    create?: XOR<coursesCreateWithoutUser_assessmentsInput, coursesUncheckedCreateWithoutUser_assessmentsInput>
    connectOrCreate?: coursesCreateOrConnectWithoutUser_assessmentsInput
    connect?: coursesWhereUniqueInput
  }

  export type sectionsCreateNestedOneWithoutUser_assessmentsInput = {
    create?: XOR<sectionsCreateWithoutUser_assessmentsInput, sectionsUncheckedCreateWithoutUser_assessmentsInput>
    connectOrCreate?: sectionsCreateOrConnectWithoutUser_assessmentsInput
    connect?: sectionsWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type coursesUpdateOneRequiredWithoutUser_assessmentsNestedInput = {
    create?: XOR<coursesCreateWithoutUser_assessmentsInput, coursesUncheckedCreateWithoutUser_assessmentsInput>
    connectOrCreate?: coursesCreateOrConnectWithoutUser_assessmentsInput
    upsert?: coursesUpsertWithoutUser_assessmentsInput
    connect?: coursesWhereUniqueInput
    update?: XOR<XOR<coursesUpdateToOneWithWhereWithoutUser_assessmentsInput, coursesUpdateWithoutUser_assessmentsInput>, coursesUncheckedUpdateWithoutUser_assessmentsInput>
  }

  export type sectionsUpdateOneWithoutUser_assessmentsNestedInput = {
    create?: XOR<sectionsCreateWithoutUser_assessmentsInput, sectionsUncheckedCreateWithoutUser_assessmentsInput>
    connectOrCreate?: sectionsCreateOrConnectWithoutUser_assessmentsInput
    upsert?: sectionsUpsertWithoutUser_assessmentsInput
    disconnect?: sectionsWhereInput | boolean
    delete?: sectionsWhereInput | boolean
    connect?: sectionsWhereUniqueInput
    update?: XOR<XOR<sectionsUpdateToOneWithWhereWithoutUser_assessmentsInput, sectionsUpdateWithoutUser_assessmentsInput>, sectionsUncheckedUpdateWithoutUser_assessmentsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumCourseStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CourseStatus | EnumCourseStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CourseStatus[] | ListEnumCourseStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CourseStatus[] | ListEnumCourseStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCourseStatusFilter<$PrismaModel> | $Enums.CourseStatus
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumCourseStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CourseStatus | EnumCourseStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CourseStatus[] | ListEnumCourseStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CourseStatus[] | ListEnumCourseStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCourseStatusWithAggregatesFilter<$PrismaModel> | $Enums.CourseStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCourseStatusFilter<$PrismaModel>
    _max?: NestedEnumCourseStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type enrollmentsCreateWithoutCoursesInput = {
    id: string
    userId: string
    enrolledAt?: Date | string
    completed?: boolean
    completedAt?: Date | string | null
  }

  export type enrollmentsUncheckedCreateWithoutCoursesInput = {
    id: string
    userId: string
    enrolledAt?: Date | string
    completed?: boolean
    completedAt?: Date | string | null
  }

  export type enrollmentsCreateOrConnectWithoutCoursesInput = {
    where: enrollmentsWhereUniqueInput
    create: XOR<enrollmentsCreateWithoutCoursesInput, enrollmentsUncheckedCreateWithoutCoursesInput>
  }

  export type enrollmentsCreateManyCoursesInputEnvelope = {
    data: enrollmentsCreateManyCoursesInput | enrollmentsCreateManyCoursesInput[]
    skipDuplicates?: boolean
  }

  export type sectionsCreateWithoutCoursesInput = {
    id: string
    order: number
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    lessons?: lessonsCreateNestedManyWithoutSectionsInput
    assessment_questions?: assessment_questionsCreateNestedManyWithoutSectionsInput
    user_assessments?: user_assessmentsCreateNestedManyWithoutSectionsInput
  }

  export type sectionsUncheckedCreateWithoutCoursesInput = {
    id: string
    order: number
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    lessons?: lessonsUncheckedCreateNestedManyWithoutSectionsInput
    assessment_questions?: assessment_questionsUncheckedCreateNestedManyWithoutSectionsInput
    user_assessments?: user_assessmentsUncheckedCreateNestedManyWithoutSectionsInput
  }

  export type sectionsCreateOrConnectWithoutCoursesInput = {
    where: sectionsWhereUniqueInput
    create: XOR<sectionsCreateWithoutCoursesInput, sectionsUncheckedCreateWithoutCoursesInput>
  }

  export type sectionsCreateManyCoursesInputEnvelope = {
    data: sectionsCreateManyCoursesInput | sectionsCreateManyCoursesInput[]
    skipDuplicates?: boolean
  }

  export type assessment_questionsCreateWithoutCoursesInput = {
    id?: string
    question: string
    options: JsonNullValueInput | InputJsonValue
    correct: string
    topic: string
    difficulty?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sections?: sectionsCreateNestedOneWithoutAssessment_questionsInput
  }

  export type assessment_questionsUncheckedCreateWithoutCoursesInput = {
    id?: string
    sectionId?: string | null
    question: string
    options: JsonNullValueInput | InputJsonValue
    correct: string
    topic: string
    difficulty?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type assessment_questionsCreateOrConnectWithoutCoursesInput = {
    where: assessment_questionsWhereUniqueInput
    create: XOR<assessment_questionsCreateWithoutCoursesInput, assessment_questionsUncheckedCreateWithoutCoursesInput>
  }

  export type assessment_questionsCreateManyCoursesInputEnvelope = {
    data: assessment_questionsCreateManyCoursesInput | assessment_questionsCreateManyCoursesInput[]
    skipDuplicates?: boolean
  }

  export type user_assessmentsCreateWithoutCoursesInput = {
    id?: string
    userId: string
    score: number
    type?: string
    answers: JsonNullValueInput | InputJsonValue
    durationSeconds?: number | null
    completedAt?: Date | string
    sections?: sectionsCreateNestedOneWithoutUser_assessmentsInput
  }

  export type user_assessmentsUncheckedCreateWithoutCoursesInput = {
    id?: string
    userId: string
    sectionId?: string | null
    score: number
    type?: string
    answers: JsonNullValueInput | InputJsonValue
    durationSeconds?: number | null
    completedAt?: Date | string
  }

  export type user_assessmentsCreateOrConnectWithoutCoursesInput = {
    where: user_assessmentsWhereUniqueInput
    create: XOR<user_assessmentsCreateWithoutCoursesInput, user_assessmentsUncheckedCreateWithoutCoursesInput>
  }

  export type user_assessmentsCreateManyCoursesInputEnvelope = {
    data: user_assessmentsCreateManyCoursesInput | user_assessmentsCreateManyCoursesInput[]
    skipDuplicates?: boolean
  }

  export type enrollmentsUpsertWithWhereUniqueWithoutCoursesInput = {
    where: enrollmentsWhereUniqueInput
    update: XOR<enrollmentsUpdateWithoutCoursesInput, enrollmentsUncheckedUpdateWithoutCoursesInput>
    create: XOR<enrollmentsCreateWithoutCoursesInput, enrollmentsUncheckedCreateWithoutCoursesInput>
  }

  export type enrollmentsUpdateWithWhereUniqueWithoutCoursesInput = {
    where: enrollmentsWhereUniqueInput
    data: XOR<enrollmentsUpdateWithoutCoursesInput, enrollmentsUncheckedUpdateWithoutCoursesInput>
  }

  export type enrollmentsUpdateManyWithWhereWithoutCoursesInput = {
    where: enrollmentsScalarWhereInput
    data: XOR<enrollmentsUpdateManyMutationInput, enrollmentsUncheckedUpdateManyWithoutCoursesInput>
  }

  export type enrollmentsScalarWhereInput = {
    AND?: enrollmentsScalarWhereInput | enrollmentsScalarWhereInput[]
    OR?: enrollmentsScalarWhereInput[]
    NOT?: enrollmentsScalarWhereInput | enrollmentsScalarWhereInput[]
    id?: StringFilter<"enrollments"> | string
    userId?: StringFilter<"enrollments"> | string
    courseId?: StringFilter<"enrollments"> | string
    enrolledAt?: DateTimeFilter<"enrollments"> | Date | string
    completed?: BoolFilter<"enrollments"> | boolean
    completedAt?: DateTimeNullableFilter<"enrollments"> | Date | string | null
  }

  export type sectionsUpsertWithWhereUniqueWithoutCoursesInput = {
    where: sectionsWhereUniqueInput
    update: XOR<sectionsUpdateWithoutCoursesInput, sectionsUncheckedUpdateWithoutCoursesInput>
    create: XOR<sectionsCreateWithoutCoursesInput, sectionsUncheckedCreateWithoutCoursesInput>
  }

  export type sectionsUpdateWithWhereUniqueWithoutCoursesInput = {
    where: sectionsWhereUniqueInput
    data: XOR<sectionsUpdateWithoutCoursesInput, sectionsUncheckedUpdateWithoutCoursesInput>
  }

  export type sectionsUpdateManyWithWhereWithoutCoursesInput = {
    where: sectionsScalarWhereInput
    data: XOR<sectionsUpdateManyMutationInput, sectionsUncheckedUpdateManyWithoutCoursesInput>
  }

  export type sectionsScalarWhereInput = {
    AND?: sectionsScalarWhereInput | sectionsScalarWhereInput[]
    OR?: sectionsScalarWhereInput[]
    NOT?: sectionsScalarWhereInput | sectionsScalarWhereInput[]
    id?: StringFilter<"sections"> | string
    courseId?: StringFilter<"sections"> | string
    order?: IntFilter<"sections"> | number
    title?: StringFilter<"sections"> | string
    description?: StringNullableFilter<"sections"> | string | null
    createdAt?: DateTimeFilter<"sections"> | Date | string
    updatedAt?: DateTimeFilter<"sections"> | Date | string
  }

  export type assessment_questionsUpsertWithWhereUniqueWithoutCoursesInput = {
    where: assessment_questionsWhereUniqueInput
    update: XOR<assessment_questionsUpdateWithoutCoursesInput, assessment_questionsUncheckedUpdateWithoutCoursesInput>
    create: XOR<assessment_questionsCreateWithoutCoursesInput, assessment_questionsUncheckedCreateWithoutCoursesInput>
  }

  export type assessment_questionsUpdateWithWhereUniqueWithoutCoursesInput = {
    where: assessment_questionsWhereUniqueInput
    data: XOR<assessment_questionsUpdateWithoutCoursesInput, assessment_questionsUncheckedUpdateWithoutCoursesInput>
  }

  export type assessment_questionsUpdateManyWithWhereWithoutCoursesInput = {
    where: assessment_questionsScalarWhereInput
    data: XOR<assessment_questionsUpdateManyMutationInput, assessment_questionsUncheckedUpdateManyWithoutCoursesInput>
  }

  export type assessment_questionsScalarWhereInput = {
    AND?: assessment_questionsScalarWhereInput | assessment_questionsScalarWhereInput[]
    OR?: assessment_questionsScalarWhereInput[]
    NOT?: assessment_questionsScalarWhereInput | assessment_questionsScalarWhereInput[]
    id?: StringFilter<"assessment_questions"> | string
    courseId?: StringFilter<"assessment_questions"> | string
    sectionId?: StringNullableFilter<"assessment_questions"> | string | null
    question?: StringFilter<"assessment_questions"> | string
    options?: JsonFilter<"assessment_questions">
    correct?: StringFilter<"assessment_questions"> | string
    topic?: StringFilter<"assessment_questions"> | string
    difficulty?: StringFilter<"assessment_questions"> | string
    createdAt?: DateTimeFilter<"assessment_questions"> | Date | string
    updatedAt?: DateTimeFilter<"assessment_questions"> | Date | string
  }

  export type user_assessmentsUpsertWithWhereUniqueWithoutCoursesInput = {
    where: user_assessmentsWhereUniqueInput
    update: XOR<user_assessmentsUpdateWithoutCoursesInput, user_assessmentsUncheckedUpdateWithoutCoursesInput>
    create: XOR<user_assessmentsCreateWithoutCoursesInput, user_assessmentsUncheckedCreateWithoutCoursesInput>
  }

  export type user_assessmentsUpdateWithWhereUniqueWithoutCoursesInput = {
    where: user_assessmentsWhereUniqueInput
    data: XOR<user_assessmentsUpdateWithoutCoursesInput, user_assessmentsUncheckedUpdateWithoutCoursesInput>
  }

  export type user_assessmentsUpdateManyWithWhereWithoutCoursesInput = {
    where: user_assessmentsScalarWhereInput
    data: XOR<user_assessmentsUpdateManyMutationInput, user_assessmentsUncheckedUpdateManyWithoutCoursesInput>
  }

  export type user_assessmentsScalarWhereInput = {
    AND?: user_assessmentsScalarWhereInput | user_assessmentsScalarWhereInput[]
    OR?: user_assessmentsScalarWhereInput[]
    NOT?: user_assessmentsScalarWhereInput | user_assessmentsScalarWhereInput[]
    id?: StringFilter<"user_assessments"> | string
    userId?: StringFilter<"user_assessments"> | string
    courseId?: StringFilter<"user_assessments"> | string
    sectionId?: StringNullableFilter<"user_assessments"> | string | null
    score?: FloatFilter<"user_assessments"> | number
    type?: StringFilter<"user_assessments"> | string
    answers?: JsonFilter<"user_assessments">
    durationSeconds?: IntNullableFilter<"user_assessments"> | number | null
    completedAt?: DateTimeFilter<"user_assessments"> | Date | string
  }

  export type coursesCreateWithoutEnrollmentsInput = {
    id: string
    slug: string
    title: string
    description: string
    thumbnail?: string | null
    status?: $Enums.CourseStatus
    students?: number
    lessons?: number
    duration?: string
    rating?: number
    category: string
    difficulty?: string | null
    creatorId: string
    outcomes?: coursesCreateoutcomesInput | string[]
    createdAt?: Date | string
    updatedAt: Date | string
    sections?: sectionsCreateNestedManyWithoutCoursesInput
    assessment_questions?: assessment_questionsCreateNestedManyWithoutCoursesInput
    user_assessments?: user_assessmentsCreateNestedManyWithoutCoursesInput
  }

  export type coursesUncheckedCreateWithoutEnrollmentsInput = {
    id: string
    slug: string
    title: string
    description: string
    thumbnail?: string | null
    status?: $Enums.CourseStatus
    students?: number
    lessons?: number
    duration?: string
    rating?: number
    category: string
    difficulty?: string | null
    creatorId: string
    outcomes?: coursesCreateoutcomesInput | string[]
    createdAt?: Date | string
    updatedAt: Date | string
    sections?: sectionsUncheckedCreateNestedManyWithoutCoursesInput
    assessment_questions?: assessment_questionsUncheckedCreateNestedManyWithoutCoursesInput
    user_assessments?: user_assessmentsUncheckedCreateNestedManyWithoutCoursesInput
  }

  export type coursesCreateOrConnectWithoutEnrollmentsInput = {
    where: coursesWhereUniqueInput
    create: XOR<coursesCreateWithoutEnrollmentsInput, coursesUncheckedCreateWithoutEnrollmentsInput>
  }

  export type coursesUpsertWithoutEnrollmentsInput = {
    update: XOR<coursesUpdateWithoutEnrollmentsInput, coursesUncheckedUpdateWithoutEnrollmentsInput>
    create: XOR<coursesCreateWithoutEnrollmentsInput, coursesUncheckedCreateWithoutEnrollmentsInput>
    where?: coursesWhereInput
  }

  export type coursesUpdateToOneWithWhereWithoutEnrollmentsInput = {
    where?: coursesWhereInput
    data: XOR<coursesUpdateWithoutEnrollmentsInput, coursesUncheckedUpdateWithoutEnrollmentsInput>
  }

  export type coursesUpdateWithoutEnrollmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCourseStatusFieldUpdateOperationsInput | $Enums.CourseStatus
    students?: IntFieldUpdateOperationsInput | number
    lessons?: IntFieldUpdateOperationsInput | number
    duration?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    creatorId?: StringFieldUpdateOperationsInput | string
    outcomes?: coursesUpdateoutcomesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sections?: sectionsUpdateManyWithoutCoursesNestedInput
    assessment_questions?: assessment_questionsUpdateManyWithoutCoursesNestedInput
    user_assessments?: user_assessmentsUpdateManyWithoutCoursesNestedInput
  }

  export type coursesUncheckedUpdateWithoutEnrollmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCourseStatusFieldUpdateOperationsInput | $Enums.CourseStatus
    students?: IntFieldUpdateOperationsInput | number
    lessons?: IntFieldUpdateOperationsInput | number
    duration?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    creatorId?: StringFieldUpdateOperationsInput | string
    outcomes?: coursesUpdateoutcomesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sections?: sectionsUncheckedUpdateManyWithoutCoursesNestedInput
    assessment_questions?: assessment_questionsUncheckedUpdateManyWithoutCoursesNestedInput
    user_assessments?: user_assessmentsUncheckedUpdateManyWithoutCoursesNestedInput
  }

  export type lessonsCreateWithoutLesson_progressInput = {
    id: string
    order: number
    title: string
    content: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt: Date | string
    sections: sectionsCreateNestedOneWithoutLessonsInput
  }

  export type lessonsUncheckedCreateWithoutLesson_progressInput = {
    id: string
    sectionId: string
    order: number
    title: string
    content: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type lessonsCreateOrConnectWithoutLesson_progressInput = {
    where: lessonsWhereUniqueInput
    create: XOR<lessonsCreateWithoutLesson_progressInput, lessonsUncheckedCreateWithoutLesson_progressInput>
  }

  export type lessonsUpsertWithoutLesson_progressInput = {
    update: XOR<lessonsUpdateWithoutLesson_progressInput, lessonsUncheckedUpdateWithoutLesson_progressInput>
    create: XOR<lessonsCreateWithoutLesson_progressInput, lessonsUncheckedCreateWithoutLesson_progressInput>
    where?: lessonsWhereInput
  }

  export type lessonsUpdateToOneWithWhereWithoutLesson_progressInput = {
    where?: lessonsWhereInput
    data: XOR<lessonsUpdateWithoutLesson_progressInput, lessonsUncheckedUpdateWithoutLesson_progressInput>
  }

  export type lessonsUpdateWithoutLesson_progressInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sections?: sectionsUpdateOneRequiredWithoutLessonsNestedInput
  }

  export type lessonsUncheckedUpdateWithoutLesson_progressInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type lesson_progressCreateWithoutLessonsInput = {
    id: string
    userId: string
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type lesson_progressUncheckedCreateWithoutLessonsInput = {
    id: string
    userId: string
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type lesson_progressCreateOrConnectWithoutLessonsInput = {
    where: lesson_progressWhereUniqueInput
    create: XOR<lesson_progressCreateWithoutLessonsInput, lesson_progressUncheckedCreateWithoutLessonsInput>
  }

  export type lesson_progressCreateManyLessonsInputEnvelope = {
    data: lesson_progressCreateManyLessonsInput | lesson_progressCreateManyLessonsInput[]
    skipDuplicates?: boolean
  }

  export type sectionsCreateWithoutLessonsInput = {
    id: string
    order: number
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    courses: coursesCreateNestedOneWithoutSectionsInput
    assessment_questions?: assessment_questionsCreateNestedManyWithoutSectionsInput
    user_assessments?: user_assessmentsCreateNestedManyWithoutSectionsInput
  }

  export type sectionsUncheckedCreateWithoutLessonsInput = {
    id: string
    courseId: string
    order: number
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    assessment_questions?: assessment_questionsUncheckedCreateNestedManyWithoutSectionsInput
    user_assessments?: user_assessmentsUncheckedCreateNestedManyWithoutSectionsInput
  }

  export type sectionsCreateOrConnectWithoutLessonsInput = {
    where: sectionsWhereUniqueInput
    create: XOR<sectionsCreateWithoutLessonsInput, sectionsUncheckedCreateWithoutLessonsInput>
  }

  export type lesson_progressUpsertWithWhereUniqueWithoutLessonsInput = {
    where: lesson_progressWhereUniqueInput
    update: XOR<lesson_progressUpdateWithoutLessonsInput, lesson_progressUncheckedUpdateWithoutLessonsInput>
    create: XOR<lesson_progressCreateWithoutLessonsInput, lesson_progressUncheckedCreateWithoutLessonsInput>
  }

  export type lesson_progressUpdateWithWhereUniqueWithoutLessonsInput = {
    where: lesson_progressWhereUniqueInput
    data: XOR<lesson_progressUpdateWithoutLessonsInput, lesson_progressUncheckedUpdateWithoutLessonsInput>
  }

  export type lesson_progressUpdateManyWithWhereWithoutLessonsInput = {
    where: lesson_progressScalarWhereInput
    data: XOR<lesson_progressUpdateManyMutationInput, lesson_progressUncheckedUpdateManyWithoutLessonsInput>
  }

  export type lesson_progressScalarWhereInput = {
    AND?: lesson_progressScalarWhereInput | lesson_progressScalarWhereInput[]
    OR?: lesson_progressScalarWhereInput[]
    NOT?: lesson_progressScalarWhereInput | lesson_progressScalarWhereInput[]
    id?: StringFilter<"lesson_progress"> | string
    lessonId?: StringFilter<"lesson_progress"> | string
    userId?: StringFilter<"lesson_progress"> | string
    completed?: BoolFilter<"lesson_progress"> | boolean
    completedAt?: DateTimeNullableFilter<"lesson_progress"> | Date | string | null
    createdAt?: DateTimeFilter<"lesson_progress"> | Date | string
  }

  export type sectionsUpsertWithoutLessonsInput = {
    update: XOR<sectionsUpdateWithoutLessonsInput, sectionsUncheckedUpdateWithoutLessonsInput>
    create: XOR<sectionsCreateWithoutLessonsInput, sectionsUncheckedCreateWithoutLessonsInput>
    where?: sectionsWhereInput
  }

  export type sectionsUpdateToOneWithWhereWithoutLessonsInput = {
    where?: sectionsWhereInput
    data: XOR<sectionsUpdateWithoutLessonsInput, sectionsUncheckedUpdateWithoutLessonsInput>
  }

  export type sectionsUpdateWithoutLessonsInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courses?: coursesUpdateOneRequiredWithoutSectionsNestedInput
    assessment_questions?: assessment_questionsUpdateManyWithoutSectionsNestedInput
    user_assessments?: user_assessmentsUpdateManyWithoutSectionsNestedInput
  }

  export type sectionsUncheckedUpdateWithoutLessonsInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assessment_questions?: assessment_questionsUncheckedUpdateManyWithoutSectionsNestedInput
    user_assessments?: user_assessmentsUncheckedUpdateManyWithoutSectionsNestedInput
  }

  export type lessonsCreateWithoutSectionsInput = {
    id: string
    order: number
    title: string
    content: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt: Date | string
    lesson_progress?: lesson_progressCreateNestedManyWithoutLessonsInput
  }

  export type lessonsUncheckedCreateWithoutSectionsInput = {
    id: string
    order: number
    title: string
    content: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt: Date | string
    lesson_progress?: lesson_progressUncheckedCreateNestedManyWithoutLessonsInput
  }

  export type lessonsCreateOrConnectWithoutSectionsInput = {
    where: lessonsWhereUniqueInput
    create: XOR<lessonsCreateWithoutSectionsInput, lessonsUncheckedCreateWithoutSectionsInput>
  }

  export type lessonsCreateManySectionsInputEnvelope = {
    data: lessonsCreateManySectionsInput | lessonsCreateManySectionsInput[]
    skipDuplicates?: boolean
  }

  export type coursesCreateWithoutSectionsInput = {
    id: string
    slug: string
    title: string
    description: string
    thumbnail?: string | null
    status?: $Enums.CourseStatus
    students?: number
    lessons?: number
    duration?: string
    rating?: number
    category: string
    difficulty?: string | null
    creatorId: string
    outcomes?: coursesCreateoutcomesInput | string[]
    createdAt?: Date | string
    updatedAt: Date | string
    enrollments?: enrollmentsCreateNestedManyWithoutCoursesInput
    assessment_questions?: assessment_questionsCreateNestedManyWithoutCoursesInput
    user_assessments?: user_assessmentsCreateNestedManyWithoutCoursesInput
  }

  export type coursesUncheckedCreateWithoutSectionsInput = {
    id: string
    slug: string
    title: string
    description: string
    thumbnail?: string | null
    status?: $Enums.CourseStatus
    students?: number
    lessons?: number
    duration?: string
    rating?: number
    category: string
    difficulty?: string | null
    creatorId: string
    outcomes?: coursesCreateoutcomesInput | string[]
    createdAt?: Date | string
    updatedAt: Date | string
    enrollments?: enrollmentsUncheckedCreateNestedManyWithoutCoursesInput
    assessment_questions?: assessment_questionsUncheckedCreateNestedManyWithoutCoursesInput
    user_assessments?: user_assessmentsUncheckedCreateNestedManyWithoutCoursesInput
  }

  export type coursesCreateOrConnectWithoutSectionsInput = {
    where: coursesWhereUniqueInput
    create: XOR<coursesCreateWithoutSectionsInput, coursesUncheckedCreateWithoutSectionsInput>
  }

  export type assessment_questionsCreateWithoutSectionsInput = {
    id?: string
    question: string
    options: JsonNullValueInput | InputJsonValue
    correct: string
    topic: string
    difficulty?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    courses: coursesCreateNestedOneWithoutAssessment_questionsInput
  }

  export type assessment_questionsUncheckedCreateWithoutSectionsInput = {
    id?: string
    courseId: string
    question: string
    options: JsonNullValueInput | InputJsonValue
    correct: string
    topic: string
    difficulty?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type assessment_questionsCreateOrConnectWithoutSectionsInput = {
    where: assessment_questionsWhereUniqueInput
    create: XOR<assessment_questionsCreateWithoutSectionsInput, assessment_questionsUncheckedCreateWithoutSectionsInput>
  }

  export type assessment_questionsCreateManySectionsInputEnvelope = {
    data: assessment_questionsCreateManySectionsInput | assessment_questionsCreateManySectionsInput[]
    skipDuplicates?: boolean
  }

  export type user_assessmentsCreateWithoutSectionsInput = {
    id?: string
    userId: string
    score: number
    type?: string
    answers: JsonNullValueInput | InputJsonValue
    durationSeconds?: number | null
    completedAt?: Date | string
    courses: coursesCreateNestedOneWithoutUser_assessmentsInput
  }

  export type user_assessmentsUncheckedCreateWithoutSectionsInput = {
    id?: string
    userId: string
    courseId: string
    score: number
    type?: string
    answers: JsonNullValueInput | InputJsonValue
    durationSeconds?: number | null
    completedAt?: Date | string
  }

  export type user_assessmentsCreateOrConnectWithoutSectionsInput = {
    where: user_assessmentsWhereUniqueInput
    create: XOR<user_assessmentsCreateWithoutSectionsInput, user_assessmentsUncheckedCreateWithoutSectionsInput>
  }

  export type user_assessmentsCreateManySectionsInputEnvelope = {
    data: user_assessmentsCreateManySectionsInput | user_assessmentsCreateManySectionsInput[]
    skipDuplicates?: boolean
  }

  export type lessonsUpsertWithWhereUniqueWithoutSectionsInput = {
    where: lessonsWhereUniqueInput
    update: XOR<lessonsUpdateWithoutSectionsInput, lessonsUncheckedUpdateWithoutSectionsInput>
    create: XOR<lessonsCreateWithoutSectionsInput, lessonsUncheckedCreateWithoutSectionsInput>
  }

  export type lessonsUpdateWithWhereUniqueWithoutSectionsInput = {
    where: lessonsWhereUniqueInput
    data: XOR<lessonsUpdateWithoutSectionsInput, lessonsUncheckedUpdateWithoutSectionsInput>
  }

  export type lessonsUpdateManyWithWhereWithoutSectionsInput = {
    where: lessonsScalarWhereInput
    data: XOR<lessonsUpdateManyMutationInput, lessonsUncheckedUpdateManyWithoutSectionsInput>
  }

  export type lessonsScalarWhereInput = {
    AND?: lessonsScalarWhereInput | lessonsScalarWhereInput[]
    OR?: lessonsScalarWhereInput[]
    NOT?: lessonsScalarWhereInput | lessonsScalarWhereInput[]
    id?: StringFilter<"lessons"> | string
    sectionId?: StringFilter<"lessons"> | string
    order?: IntFilter<"lessons"> | number
    title?: StringFilter<"lessons"> | string
    content?: JsonFilter<"lessons">
    createdAt?: DateTimeFilter<"lessons"> | Date | string
    updatedAt?: DateTimeFilter<"lessons"> | Date | string
  }

  export type coursesUpsertWithoutSectionsInput = {
    update: XOR<coursesUpdateWithoutSectionsInput, coursesUncheckedUpdateWithoutSectionsInput>
    create: XOR<coursesCreateWithoutSectionsInput, coursesUncheckedCreateWithoutSectionsInput>
    where?: coursesWhereInput
  }

  export type coursesUpdateToOneWithWhereWithoutSectionsInput = {
    where?: coursesWhereInput
    data: XOR<coursesUpdateWithoutSectionsInput, coursesUncheckedUpdateWithoutSectionsInput>
  }

  export type coursesUpdateWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCourseStatusFieldUpdateOperationsInput | $Enums.CourseStatus
    students?: IntFieldUpdateOperationsInput | number
    lessons?: IntFieldUpdateOperationsInput | number
    duration?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    creatorId?: StringFieldUpdateOperationsInput | string
    outcomes?: coursesUpdateoutcomesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: enrollmentsUpdateManyWithoutCoursesNestedInput
    assessment_questions?: assessment_questionsUpdateManyWithoutCoursesNestedInput
    user_assessments?: user_assessmentsUpdateManyWithoutCoursesNestedInput
  }

  export type coursesUncheckedUpdateWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCourseStatusFieldUpdateOperationsInput | $Enums.CourseStatus
    students?: IntFieldUpdateOperationsInput | number
    lessons?: IntFieldUpdateOperationsInput | number
    duration?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    creatorId?: StringFieldUpdateOperationsInput | string
    outcomes?: coursesUpdateoutcomesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: enrollmentsUncheckedUpdateManyWithoutCoursesNestedInput
    assessment_questions?: assessment_questionsUncheckedUpdateManyWithoutCoursesNestedInput
    user_assessments?: user_assessmentsUncheckedUpdateManyWithoutCoursesNestedInput
  }

  export type assessment_questionsUpsertWithWhereUniqueWithoutSectionsInput = {
    where: assessment_questionsWhereUniqueInput
    update: XOR<assessment_questionsUpdateWithoutSectionsInput, assessment_questionsUncheckedUpdateWithoutSectionsInput>
    create: XOR<assessment_questionsCreateWithoutSectionsInput, assessment_questionsUncheckedCreateWithoutSectionsInput>
  }

  export type assessment_questionsUpdateWithWhereUniqueWithoutSectionsInput = {
    where: assessment_questionsWhereUniqueInput
    data: XOR<assessment_questionsUpdateWithoutSectionsInput, assessment_questionsUncheckedUpdateWithoutSectionsInput>
  }

  export type assessment_questionsUpdateManyWithWhereWithoutSectionsInput = {
    where: assessment_questionsScalarWhereInput
    data: XOR<assessment_questionsUpdateManyMutationInput, assessment_questionsUncheckedUpdateManyWithoutSectionsInput>
  }

  export type user_assessmentsUpsertWithWhereUniqueWithoutSectionsInput = {
    where: user_assessmentsWhereUniqueInput
    update: XOR<user_assessmentsUpdateWithoutSectionsInput, user_assessmentsUncheckedUpdateWithoutSectionsInput>
    create: XOR<user_assessmentsCreateWithoutSectionsInput, user_assessmentsUncheckedCreateWithoutSectionsInput>
  }

  export type user_assessmentsUpdateWithWhereUniqueWithoutSectionsInput = {
    where: user_assessmentsWhereUniqueInput
    data: XOR<user_assessmentsUpdateWithoutSectionsInput, user_assessmentsUncheckedUpdateWithoutSectionsInput>
  }

  export type user_assessmentsUpdateManyWithWhereWithoutSectionsInput = {
    where: user_assessmentsScalarWhereInput
    data: XOR<user_assessmentsUpdateManyMutationInput, user_assessmentsUncheckedUpdateManyWithoutSectionsInput>
  }

  export type coursesCreateWithoutAssessment_questionsInput = {
    id: string
    slug: string
    title: string
    description: string
    thumbnail?: string | null
    status?: $Enums.CourseStatus
    students?: number
    lessons?: number
    duration?: string
    rating?: number
    category: string
    difficulty?: string | null
    creatorId: string
    outcomes?: coursesCreateoutcomesInput | string[]
    createdAt?: Date | string
    updatedAt: Date | string
    enrollments?: enrollmentsCreateNestedManyWithoutCoursesInput
    sections?: sectionsCreateNestedManyWithoutCoursesInput
    user_assessments?: user_assessmentsCreateNestedManyWithoutCoursesInput
  }

  export type coursesUncheckedCreateWithoutAssessment_questionsInput = {
    id: string
    slug: string
    title: string
    description: string
    thumbnail?: string | null
    status?: $Enums.CourseStatus
    students?: number
    lessons?: number
    duration?: string
    rating?: number
    category: string
    difficulty?: string | null
    creatorId: string
    outcomes?: coursesCreateoutcomesInput | string[]
    createdAt?: Date | string
    updatedAt: Date | string
    enrollments?: enrollmentsUncheckedCreateNestedManyWithoutCoursesInput
    sections?: sectionsUncheckedCreateNestedManyWithoutCoursesInput
    user_assessments?: user_assessmentsUncheckedCreateNestedManyWithoutCoursesInput
  }

  export type coursesCreateOrConnectWithoutAssessment_questionsInput = {
    where: coursesWhereUniqueInput
    create: XOR<coursesCreateWithoutAssessment_questionsInput, coursesUncheckedCreateWithoutAssessment_questionsInput>
  }

  export type sectionsCreateWithoutAssessment_questionsInput = {
    id: string
    order: number
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    lessons?: lessonsCreateNestedManyWithoutSectionsInput
    courses: coursesCreateNestedOneWithoutSectionsInput
    user_assessments?: user_assessmentsCreateNestedManyWithoutSectionsInput
  }

  export type sectionsUncheckedCreateWithoutAssessment_questionsInput = {
    id: string
    courseId: string
    order: number
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    lessons?: lessonsUncheckedCreateNestedManyWithoutSectionsInput
    user_assessments?: user_assessmentsUncheckedCreateNestedManyWithoutSectionsInput
  }

  export type sectionsCreateOrConnectWithoutAssessment_questionsInput = {
    where: sectionsWhereUniqueInput
    create: XOR<sectionsCreateWithoutAssessment_questionsInput, sectionsUncheckedCreateWithoutAssessment_questionsInput>
  }

  export type coursesUpsertWithoutAssessment_questionsInput = {
    update: XOR<coursesUpdateWithoutAssessment_questionsInput, coursesUncheckedUpdateWithoutAssessment_questionsInput>
    create: XOR<coursesCreateWithoutAssessment_questionsInput, coursesUncheckedCreateWithoutAssessment_questionsInput>
    where?: coursesWhereInput
  }

  export type coursesUpdateToOneWithWhereWithoutAssessment_questionsInput = {
    where?: coursesWhereInput
    data: XOR<coursesUpdateWithoutAssessment_questionsInput, coursesUncheckedUpdateWithoutAssessment_questionsInput>
  }

  export type coursesUpdateWithoutAssessment_questionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCourseStatusFieldUpdateOperationsInput | $Enums.CourseStatus
    students?: IntFieldUpdateOperationsInput | number
    lessons?: IntFieldUpdateOperationsInput | number
    duration?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    creatorId?: StringFieldUpdateOperationsInput | string
    outcomes?: coursesUpdateoutcomesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: enrollmentsUpdateManyWithoutCoursesNestedInput
    sections?: sectionsUpdateManyWithoutCoursesNestedInput
    user_assessments?: user_assessmentsUpdateManyWithoutCoursesNestedInput
  }

  export type coursesUncheckedUpdateWithoutAssessment_questionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCourseStatusFieldUpdateOperationsInput | $Enums.CourseStatus
    students?: IntFieldUpdateOperationsInput | number
    lessons?: IntFieldUpdateOperationsInput | number
    duration?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    creatorId?: StringFieldUpdateOperationsInput | string
    outcomes?: coursesUpdateoutcomesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: enrollmentsUncheckedUpdateManyWithoutCoursesNestedInput
    sections?: sectionsUncheckedUpdateManyWithoutCoursesNestedInput
    user_assessments?: user_assessmentsUncheckedUpdateManyWithoutCoursesNestedInput
  }

  export type sectionsUpsertWithoutAssessment_questionsInput = {
    update: XOR<sectionsUpdateWithoutAssessment_questionsInput, sectionsUncheckedUpdateWithoutAssessment_questionsInput>
    create: XOR<sectionsCreateWithoutAssessment_questionsInput, sectionsUncheckedCreateWithoutAssessment_questionsInput>
    where?: sectionsWhereInput
  }

  export type sectionsUpdateToOneWithWhereWithoutAssessment_questionsInput = {
    where?: sectionsWhereInput
    data: XOR<sectionsUpdateWithoutAssessment_questionsInput, sectionsUncheckedUpdateWithoutAssessment_questionsInput>
  }

  export type sectionsUpdateWithoutAssessment_questionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lessons?: lessonsUpdateManyWithoutSectionsNestedInput
    courses?: coursesUpdateOneRequiredWithoutSectionsNestedInput
    user_assessments?: user_assessmentsUpdateManyWithoutSectionsNestedInput
  }

  export type sectionsUncheckedUpdateWithoutAssessment_questionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lessons?: lessonsUncheckedUpdateManyWithoutSectionsNestedInput
    user_assessments?: user_assessmentsUncheckedUpdateManyWithoutSectionsNestedInput
  }

  export type coursesCreateWithoutUser_assessmentsInput = {
    id: string
    slug: string
    title: string
    description: string
    thumbnail?: string | null
    status?: $Enums.CourseStatus
    students?: number
    lessons?: number
    duration?: string
    rating?: number
    category: string
    difficulty?: string | null
    creatorId: string
    outcomes?: coursesCreateoutcomesInput | string[]
    createdAt?: Date | string
    updatedAt: Date | string
    enrollments?: enrollmentsCreateNestedManyWithoutCoursesInput
    sections?: sectionsCreateNestedManyWithoutCoursesInput
    assessment_questions?: assessment_questionsCreateNestedManyWithoutCoursesInput
  }

  export type coursesUncheckedCreateWithoutUser_assessmentsInput = {
    id: string
    slug: string
    title: string
    description: string
    thumbnail?: string | null
    status?: $Enums.CourseStatus
    students?: number
    lessons?: number
    duration?: string
    rating?: number
    category: string
    difficulty?: string | null
    creatorId: string
    outcomes?: coursesCreateoutcomesInput | string[]
    createdAt?: Date | string
    updatedAt: Date | string
    enrollments?: enrollmentsUncheckedCreateNestedManyWithoutCoursesInput
    sections?: sectionsUncheckedCreateNestedManyWithoutCoursesInput
    assessment_questions?: assessment_questionsUncheckedCreateNestedManyWithoutCoursesInput
  }

  export type coursesCreateOrConnectWithoutUser_assessmentsInput = {
    where: coursesWhereUniqueInput
    create: XOR<coursesCreateWithoutUser_assessmentsInput, coursesUncheckedCreateWithoutUser_assessmentsInput>
  }

  export type sectionsCreateWithoutUser_assessmentsInput = {
    id: string
    order: number
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    lessons?: lessonsCreateNestedManyWithoutSectionsInput
    courses: coursesCreateNestedOneWithoutSectionsInput
    assessment_questions?: assessment_questionsCreateNestedManyWithoutSectionsInput
  }

  export type sectionsUncheckedCreateWithoutUser_assessmentsInput = {
    id: string
    courseId: string
    order: number
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    lessons?: lessonsUncheckedCreateNestedManyWithoutSectionsInput
    assessment_questions?: assessment_questionsUncheckedCreateNestedManyWithoutSectionsInput
  }

  export type sectionsCreateOrConnectWithoutUser_assessmentsInput = {
    where: sectionsWhereUniqueInput
    create: XOR<sectionsCreateWithoutUser_assessmentsInput, sectionsUncheckedCreateWithoutUser_assessmentsInput>
  }

  export type coursesUpsertWithoutUser_assessmentsInput = {
    update: XOR<coursesUpdateWithoutUser_assessmentsInput, coursesUncheckedUpdateWithoutUser_assessmentsInput>
    create: XOR<coursesCreateWithoutUser_assessmentsInput, coursesUncheckedCreateWithoutUser_assessmentsInput>
    where?: coursesWhereInput
  }

  export type coursesUpdateToOneWithWhereWithoutUser_assessmentsInput = {
    where?: coursesWhereInput
    data: XOR<coursesUpdateWithoutUser_assessmentsInput, coursesUncheckedUpdateWithoutUser_assessmentsInput>
  }

  export type coursesUpdateWithoutUser_assessmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCourseStatusFieldUpdateOperationsInput | $Enums.CourseStatus
    students?: IntFieldUpdateOperationsInput | number
    lessons?: IntFieldUpdateOperationsInput | number
    duration?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    creatorId?: StringFieldUpdateOperationsInput | string
    outcomes?: coursesUpdateoutcomesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: enrollmentsUpdateManyWithoutCoursesNestedInput
    sections?: sectionsUpdateManyWithoutCoursesNestedInput
    assessment_questions?: assessment_questionsUpdateManyWithoutCoursesNestedInput
  }

  export type coursesUncheckedUpdateWithoutUser_assessmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumCourseStatusFieldUpdateOperationsInput | $Enums.CourseStatus
    students?: IntFieldUpdateOperationsInput | number
    lessons?: IntFieldUpdateOperationsInput | number
    duration?: StringFieldUpdateOperationsInput | string
    rating?: FloatFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    difficulty?: NullableStringFieldUpdateOperationsInput | string | null
    creatorId?: StringFieldUpdateOperationsInput | string
    outcomes?: coursesUpdateoutcomesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: enrollmentsUncheckedUpdateManyWithoutCoursesNestedInput
    sections?: sectionsUncheckedUpdateManyWithoutCoursesNestedInput
    assessment_questions?: assessment_questionsUncheckedUpdateManyWithoutCoursesNestedInput
  }

  export type sectionsUpsertWithoutUser_assessmentsInput = {
    update: XOR<sectionsUpdateWithoutUser_assessmentsInput, sectionsUncheckedUpdateWithoutUser_assessmentsInput>
    create: XOR<sectionsCreateWithoutUser_assessmentsInput, sectionsUncheckedCreateWithoutUser_assessmentsInput>
    where?: sectionsWhereInput
  }

  export type sectionsUpdateToOneWithWhereWithoutUser_assessmentsInput = {
    where?: sectionsWhereInput
    data: XOR<sectionsUpdateWithoutUser_assessmentsInput, sectionsUncheckedUpdateWithoutUser_assessmentsInput>
  }

  export type sectionsUpdateWithoutUser_assessmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lessons?: lessonsUpdateManyWithoutSectionsNestedInput
    courses?: coursesUpdateOneRequiredWithoutSectionsNestedInput
    assessment_questions?: assessment_questionsUpdateManyWithoutSectionsNestedInput
  }

  export type sectionsUncheckedUpdateWithoutUser_assessmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lessons?: lessonsUncheckedUpdateManyWithoutSectionsNestedInput
    assessment_questions?: assessment_questionsUncheckedUpdateManyWithoutSectionsNestedInput
  }

  export type enrollmentsCreateManyCoursesInput = {
    id: string
    userId: string
    enrolledAt?: Date | string
    completed?: boolean
    completedAt?: Date | string | null
  }

  export type sectionsCreateManyCoursesInput = {
    id: string
    order: number
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type assessment_questionsCreateManyCoursesInput = {
    id?: string
    sectionId?: string | null
    question: string
    options: JsonNullValueInput | InputJsonValue
    correct: string
    topic: string
    difficulty?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type user_assessmentsCreateManyCoursesInput = {
    id?: string
    userId: string
    sectionId?: string | null
    score: number
    type?: string
    answers: JsonNullValueInput | InputJsonValue
    durationSeconds?: number | null
    completedAt?: Date | string
  }

  export type enrollmentsUpdateWithoutCoursesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type enrollmentsUncheckedUpdateWithoutCoursesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type enrollmentsUncheckedUpdateManyWithoutCoursesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type sectionsUpdateWithoutCoursesInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lessons?: lessonsUpdateManyWithoutSectionsNestedInput
    assessment_questions?: assessment_questionsUpdateManyWithoutSectionsNestedInput
    user_assessments?: user_assessmentsUpdateManyWithoutSectionsNestedInput
  }

  export type sectionsUncheckedUpdateWithoutCoursesInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lessons?: lessonsUncheckedUpdateManyWithoutSectionsNestedInput
    assessment_questions?: assessment_questionsUncheckedUpdateManyWithoutSectionsNestedInput
    user_assessments?: user_assessmentsUncheckedUpdateManyWithoutSectionsNestedInput
  }

  export type sectionsUncheckedUpdateManyWithoutCoursesInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type assessment_questionsUpdateWithoutCoursesInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    correct?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sections?: sectionsUpdateOneWithoutAssessment_questionsNestedInput
  }

  export type assessment_questionsUncheckedUpdateWithoutCoursesInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: NullableStringFieldUpdateOperationsInput | string | null
    question?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    correct?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type assessment_questionsUncheckedUpdateManyWithoutCoursesInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: NullableStringFieldUpdateOperationsInput | string | null
    question?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    correct?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_assessmentsUpdateWithoutCoursesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sections?: sectionsUpdateOneWithoutUser_assessmentsNestedInput
  }

  export type user_assessmentsUncheckedUpdateWithoutCoursesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sectionId?: NullableStringFieldUpdateOperationsInput | string | null
    score?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_assessmentsUncheckedUpdateManyWithoutCoursesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sectionId?: NullableStringFieldUpdateOperationsInput | string | null
    score?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type lesson_progressCreateManyLessonsInput = {
    id: string
    userId: string
    completed?: boolean
    completedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type lesson_progressUpdateWithoutLessonsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type lesson_progressUncheckedUpdateWithoutLessonsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type lesson_progressUncheckedUpdateManyWithoutLessonsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    completed?: BoolFieldUpdateOperationsInput | boolean
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type lessonsCreateManySectionsInput = {
    id: string
    order: number
    title: string
    content: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt: Date | string
  }

  export type assessment_questionsCreateManySectionsInput = {
    id?: string
    courseId: string
    question: string
    options: JsonNullValueInput | InputJsonValue
    correct: string
    topic: string
    difficulty?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type user_assessmentsCreateManySectionsInput = {
    id?: string
    userId: string
    courseId: string
    score: number
    type?: string
    answers: JsonNullValueInput | InputJsonValue
    durationSeconds?: number | null
    completedAt?: Date | string
  }

  export type lessonsUpdateWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lesson_progress?: lesson_progressUpdateManyWithoutLessonsNestedInput
  }

  export type lessonsUncheckedUpdateWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lesson_progress?: lesson_progressUncheckedUpdateManyWithoutLessonsNestedInput
  }

  export type lessonsUncheckedUpdateManyWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type assessment_questionsUpdateWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    correct?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courses?: coursesUpdateOneRequiredWithoutAssessment_questionsNestedInput
  }

  export type assessment_questionsUncheckedUpdateWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    correct?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type assessment_questionsUncheckedUpdateManyWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    question?: StringFieldUpdateOperationsInput | string
    options?: JsonNullValueInput | InputJsonValue
    correct?: StringFieldUpdateOperationsInput | string
    topic?: StringFieldUpdateOperationsInput | string
    difficulty?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_assessmentsUpdateWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    courses?: coursesUpdateOneRequiredWithoutUser_assessmentsNestedInput
  }

  export type user_assessmentsUncheckedUpdateWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_assessmentsUncheckedUpdateManyWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    answers?: JsonNullValueInput | InputJsonValue
    durationSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}