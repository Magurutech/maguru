
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
    sections: 'sections'
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
      modelProps: "course_completions" | "courses" | "enrollments" | "lesson_progress" | "lessons" | "sections"
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
  }

  export type CoursesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enrollments?: boolean | CoursesCountOutputTypeCountEnrollmentsArgs
    sections?: boolean | CoursesCountOutputTypeCountSectionsArgs
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
  }

  export type SectionsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lessons?: boolean | SectionsCountOutputTypeCountLessonsArgs
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
    createdAt?: boolean
    updatedAt?: boolean
    enrollments?: boolean | courses$enrollmentsArgs<ExtArgs>
    sections?: boolean | courses$sectionsArgs<ExtArgs>
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
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type coursesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "slug" | "title" | "description" | "thumbnail" | "status" | "students" | "lessons" | "duration" | "rating" | "category" | "difficulty" | "creatorId" | "createdAt" | "updatedAt", ExtArgs["result"]["courses"]>
  export type coursesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    enrollments?: boolean | courses$enrollmentsArgs<ExtArgs>
    sections?: boolean | courses$sectionsArgs<ExtArgs>
    _count?: boolean | CoursesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type coursesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type coursesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $coursesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "courses"
    objects: {
      enrollments: Prisma.$enrollmentsPayload<ExtArgs>[]
      sections: Prisma.$sectionsPayload<ExtArgs>[]
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


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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
    createdAt?: DateTimeFilter<"courses"> | Date | string
    updatedAt?: DateTimeFilter<"courses"> | Date | string
    enrollments?: EnrollmentsListRelationFilter
    sections?: SectionsListRelationFilter
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
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enrollments?: enrollmentsOrderByRelationAggregateInput
    sections?: sectionsOrderByRelationAggregateInput
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
    createdAt?: DateTimeFilter<"courses"> | Date | string
    updatedAt?: DateTimeFilter<"courses"> | Date | string
    enrollments?: EnrollmentsListRelationFilter
    sections?: SectionsListRelationFilter
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
    createdAt?: Date | string
    updatedAt: Date | string
    enrollments?: enrollmentsCreateNestedManyWithoutCoursesInput
    sections?: sectionsCreateNestedManyWithoutCoursesInput
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
    createdAt?: Date | string
    updatedAt: Date | string
    enrollments?: enrollmentsUncheckedCreateNestedManyWithoutCoursesInput
    sections?: sectionsUncheckedCreateNestedManyWithoutCoursesInput
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: enrollmentsUpdateManyWithoutCoursesNestedInput
    sections?: sectionsUpdateManyWithoutCoursesNestedInput
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: enrollmentsUncheckedUpdateManyWithoutCoursesNestedInput
    sections?: sectionsUncheckedUpdateManyWithoutCoursesNestedInput
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

  export type enrollmentsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type sectionsOrderByRelationAggregateInput = {
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

  export type lessonsUncheckedCreateNestedManyWithoutSectionsInput = {
    create?: XOR<lessonsCreateWithoutSectionsInput, lessonsUncheckedCreateWithoutSectionsInput> | lessonsCreateWithoutSectionsInput[] | lessonsUncheckedCreateWithoutSectionsInput[]
    connectOrCreate?: lessonsCreateOrConnectWithoutSectionsInput | lessonsCreateOrConnectWithoutSectionsInput[]
    createMany?: lessonsCreateManySectionsInputEnvelope
    connect?: lessonsWhereUniqueInput | lessonsWhereUniqueInput[]
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
  }

  export type sectionsUncheckedCreateWithoutCoursesInput = {
    id: string
    order: number
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
    lessons?: lessonsUncheckedCreateNestedManyWithoutSectionsInput
  }

  export type sectionsCreateOrConnectWithoutCoursesInput = {
    where: sectionsWhereUniqueInput
    create: XOR<sectionsCreateWithoutCoursesInput, sectionsUncheckedCreateWithoutCoursesInput>
  }

  export type sectionsCreateManyCoursesInputEnvelope = {
    data: sectionsCreateManyCoursesInput | sectionsCreateManyCoursesInput[]
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
    createdAt?: Date | string
    updatedAt: Date | string
    sections?: sectionsCreateNestedManyWithoutCoursesInput
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
    createdAt?: Date | string
    updatedAt: Date | string
    sections?: sectionsUncheckedCreateNestedManyWithoutCoursesInput
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sections?: sectionsUpdateManyWithoutCoursesNestedInput
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sections?: sectionsUncheckedUpdateManyWithoutCoursesNestedInput
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
  }

  export type sectionsUncheckedCreateWithoutLessonsInput = {
    id: string
    courseId: string
    order: number
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt: Date | string
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
  }

  export type sectionsUncheckedUpdateWithoutLessonsInput = {
    id?: StringFieldUpdateOperationsInput | string
    courseId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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
    createdAt?: Date | string
    updatedAt: Date | string
    enrollments?: enrollmentsCreateNestedManyWithoutCoursesInput
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
    createdAt?: Date | string
    updatedAt: Date | string
    enrollments?: enrollmentsUncheckedCreateNestedManyWithoutCoursesInput
  }

  export type coursesCreateOrConnectWithoutSectionsInput = {
    where: coursesWhereUniqueInput
    create: XOR<coursesCreateWithoutSectionsInput, coursesUncheckedCreateWithoutSectionsInput>
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: enrollmentsUpdateManyWithoutCoursesNestedInput
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enrollments?: enrollmentsUncheckedUpdateManyWithoutCoursesNestedInput
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
  }

  export type sectionsUncheckedUpdateWithoutCoursesInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lessons?: lessonsUncheckedUpdateManyWithoutSectionsNestedInput
  }

  export type sectionsUncheckedUpdateManyWithoutCoursesInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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