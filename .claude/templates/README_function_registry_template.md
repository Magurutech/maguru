# [Feature Name] [Folder Type] - Function Registry

Brief description of what this directory contains and its role in the Maguru architecture.

## Available Functions

### fileName.ts
- `functionName(param1: Type, param2: Type)` - Brief description of what this function does
- `anotherFunction(id: string)` - Another function description
- `utilityFunction(data: DataType)` - Utility function description

### anotherFile.ts  
- `helperFunction(input: InputType)` - Helper function description
- `validationFunction(data: unknown)` - Validation function description

## Usage Examples

### FileName
```typescript
import { ClassName } from './fileName'

const instance = new ClassName()

// Example usage
const result = await instance.functionName(param1, param2)

// Another example
const validated = instance.validationFunction(data)
```

## Architecture Notes

- **Layer Role**: [Service/Adapter/Component/Util] layer description
- **Dependencies**: Key dependencies this module relies on
- **Data Flow**: How data flows through these functions
- **Error Handling**: Error handling approach used
- **Testing**: Testing strategy and coverage

## Dependencies

- `dependency1` - Purpose
- `dependency2` - Purpose
- Custom types from `../types/index.ts`

## Testing

Run tests:
```bash
yarn test path/to/this/folder
```

Individual file tests:
```bash
yarn test fileName.test.ts
```

## Function Registry Guidelines

### Adding New Functions

1. **Before Creating**: Check this README.md for similar existing functions
2. **After Creating**: Update this README.md with the new function entry
3. **Function Documentation Format**: 
   ```
   - `functionName(param1: Type, param2?: OptionalType)` - Clear, concise description
   ```

### Function Naming Conventions

- Use descriptive names that indicate purpose
- Follow existing patterns in the codebase
- Use consistent verb patterns:
  - `get*` - Retrieve data
  - `create*` - Create new resources
  - `update*` - Modify existing resources
  - `delete*` - Remove resources
  - `validate*` - Validation functions
  - `format*` - Data transformation

### Similarity Prevention

The function registry helps prevent:
- **Exact Duplicates**: Functions with identical names
- **Semantic Duplicates**: `createUser` vs `addUser`
- **Typo Variations**: `getUserData` vs `getUserDta`
- **Description Overlaps**: Functions with very similar purposes

This registry is monitored by Claude Code hooks to prevent function duplication and maintain code quality.