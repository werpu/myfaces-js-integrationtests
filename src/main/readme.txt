This is the branch for the jsf 2.2 features of the apache myfaces javascripts

Following things have to be taken into consideration
a) for the project stage the url has to have a parameter: stage
b) for the getSeparatorChar the url has to have a parameter: separator which is urlEncoded
c) multipart form requests via the iframe have to be resolved serverside over the parts api
(hence request params are not present anymore since every param is a part)


Following config params are present in the system:
We have to make a distinction between structural config params
which hold the system via weak binding together and runtime config
params which influence the runtime behavior


Structural params

  -  jsfAjaxImpl points to the ajax implementation which has to implement the full api default is
            myfaces._impl.core.Impl

  -  transport points to the desired transport gateway default value is  myfaces._impl.xhrCore._Transports

  -  responseHandler is the response handler responsible for providing the response
        the default value is: myfaces._impl.xhrCore._AjaxResponse

  -  eventListenerQueue: The weak binding to the event listener queue singleton defaults to myfaces._impl._util._ListenerQueue


  -  updateParser: binding to the parsing engine, default value is myfaces._impl._util._HtmlStripper


  -  defaultErrorOutput points to the default error output which is alert per default but could be set to console.error
    for instance. The syntax must be defaultErrorOutput(<errorMessage>)


Runtime config params

  - delay: an integer value specifying a possible delay in the implementation

  - separatorchar: override for the separator character which normally is set by a url param

  - projectStage: override for the project stage which normally is set via url parameter

  - no_portlet_env: if set to true updates all forms under viewroot

  - locale: sets the current locale otherwise the system locale is taken per default

  - queueSize: sets the maximum queue size for the ajax queue

  - timeout: sets a timeout for a request until the next request is fetched

  - alarmThreshold: currently not used should be a threshold for internal error handling







