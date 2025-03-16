using System;
using System.Transactions;

public static class TransactionScopeHelper
{
    public static void Execute(Action action,
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
            action(); 
            scope.Complete(); 
        }
    }

    public static void Execute<T>(Func<T> function,
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
            T result = function();
            scope.Complete();
        }
    }
}
