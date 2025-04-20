using System.Transactions;

public static class TransactionScopeHelper
{
    public static async Task ExecuteAsync(Func<Task> action,
        TransactionScopeOption scopeOption = TransactionScopeOption.Required,
        IsolationLevel isolationLevel = IsolationLevel.ReadCommitted,
        int timeoutSeconds = 30)
    {
        var transactionOptions = new TransactionOptions
        {
            IsolationLevel = isolationLevel,
            Timeout = TimeSpan.FromSeconds(timeoutSeconds)
        };

        using (var scope = new TransactionScope(scopeOption, transactionOptions, TransactionScopeAsyncFlowOption.Enabled))
        {
            await action();
            scope.Complete();
        }
    }

    public static async Task<T> ExecuteAsync<T>(Func<Task<T>> function,
        TransactionScopeOption scopeOption = TransactionScopeOption.Required,
        IsolationLevel isolationLevel = IsolationLevel.ReadCommitted,
        int timeoutSeconds = 30)
    {
        var transactionOptions = new TransactionOptions
        {
            IsolationLevel = isolationLevel,
            Timeout = TimeSpan.FromSeconds(timeoutSeconds)
        };

        using (var scope = new TransactionScope(scopeOption, transactionOptions, TransactionScopeAsyncFlowOption.Enabled))
        {
            T result = await function();
            scope.Complete();
            return result;
        }
    }
}
