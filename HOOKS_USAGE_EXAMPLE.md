# Hooks Usage Guide

Your hooks have been updated to work with **both** `requestPython` and `requestGeneralAuth` (or any other axios instance).

## How It Works

All hooks now accept an optional `apiClient` parameter. If not provided, they default to `requestPython` for backward compatibility.

## Usage Examples

### Using with requestPython (default)

```javascript
import useGetQuery from "@/hooks/python/useGetQuery";

// No apiClient specified - uses requestPython by default
const { data, isLoading } = useGetQuery({
  key: "employees",
  url: "/employees",
});
```

### Using with requestGeneralAuth

```javascript
import useGetQuery from "@/hooks/python/useGetQuery";
import { requestGeneralAuth } from "@/services/api";

// Explicitly pass requestGeneralAuth as apiClient
const { data, isLoading } = useGetQuery({
  key: "auth-users",
  url: "/users",
  apiClient: requestGeneralAuth, // ✅ Use different API
});
```

### POST Example with requestGeneralAuth

const { mutate } = usePostPythonQuery({
listKeyId: "auth-users",
apiClient: requestGeneralAuth, // ✅ Use different API
});

// Later in your code
mutate({
url: "/users",
attributes: { name: "John", email: "john@example.com" },
});

````

### PUT Example

```javascript
import usePutQuery from "@/hooks/python/usePutQuery";
import { requestGeneralAuth } from "@/services/api";

const { mutate } = usePutQuery({
  listKeyId: "user-detail",
  apiClient: requestGeneralAuth,
});

mutate({
  url: "/users/123",
  attributes: { name: "Updated Name" },
});
````

### PATCH Example

```javascript
import usePatchPythonQuery from "@/hooks/python/usePatchQuery";
import { requestGeneralAuth } from "@/services/api";

const mutation = usePatchPythonQuery({
  listKeyId: "user-detail",
  apiClient: requestGeneralAuth,
});

mutation.mutate({
  url: "/users/123",
  attributes: { status: "active" },
});
```

## Benefits of This Approach

✅ **Single source of truth** - One set of hooks for all APIs  
✅ **Backward compatible** - Existing code continues to work  
✅ **Flexible** - Easy to switch between APIs  
✅ **Maintainable** - Changes apply everywhere  
✅ **Scalable** - Easy to add more API clients in the future

## Summary

**You DON'T need to create separate hooks!** Just pass `apiClient: requestGeneralAuth` when calling the hook, and it will use that API instead of the default `requestPython`.
