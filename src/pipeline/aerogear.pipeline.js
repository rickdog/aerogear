(function( aerogear, undefined ) {
    function isArray( obj ) {
        return ({}).toString.call( obj ) === "[object Array]";
    }

    /**
     * aerogear.pipeline
     *
     * The aerogear.pipeline namespace provides a persistence API that is protocol agnostic and does not depend on any certain data model. Through the use of adapters, both provided and custom, user supplied, this library provides common methods like read, save and delete that will just work.
     *
     * `aerogear.pipeline( pipe ) -> Object`
     * - **pipe** (Mixed) When passing a pipeConfiguration object to `add`, the following items can be provided:
     *  - **name** - String (Required), the name that the pipe will later be referenced by
     *  - **type** - String (Optional, default - "rest"), the type of pipe as determined by the adapter used
     *  - **recordId** - String (Optional, default - "id"), the identifier used to denote the unique id for each record in the data associated with this pipe
     *  - **settings** - Object (Optional, default - {}), the settings to be passed to the adapter
     *   - Adapters may have a number of varying configuration settings.
     *
     * Returns an object representing a collection of server connections (pipes) and their corresponding data models. This object provides a standard way to communicate with the server no matter the data format or transport expected.
     *
     * ##### Example
     *
     *     // Create a single pipe using the default adapter
     *     var pipeline = aerogear.pipeline( "tasks" );
     *
     *     // Create multiple pipes using the default adapter
     *     var myPipeline = aerogear.pipeline( [ "tasks", "projects" ] );
     **/
    aerogear.pipeline = function( pipe ) {
        var pipeline = {
                pipes: {},
                /**
                 * aerogear.pipeline#add( pipe ) -> Object
                 * - pipe (Mixed): This can be a variety of types specifying how to create the pipe as illustrated below
                 *
                 * When passing a pipeConfiguration object to `add`, the following items can be provided:
                 *  - **name** - String (Required), the name that the pipe will later be referenced by
                 *  - **type** - String (Optional, default - "rest"), the type of pipe as determined by the adapter used
                 *  - **recordId** - String (Optional, default - "id"), the identifier used to denote the unique id for each record in the data associated with this pipe
                 *  - **settings** - Object (Optional, default - {}), the settings to be passed to the adapter
                 *   - Adapters may have a number of varying configuration settings.
                 *
                 * Returns the full pipeline object with the new pipe(s) added
                 *
                 *     // Add a single pipe using the default configuration (rest).
                 *     aerogear.pipeline.add( String pipeName );
                 *
                 *     // Add multiple pipes all using the default configuration (rest).
                 *     aerogear.pipeline.add( Array[String] pipeNames );
                 *
                 *     // Add one or more pipe configuration objects.
                 *     aerogear.pipeline.add( Object/Array[Object] pipeConfigurations )
                 *
                 * The default pipe type is `rest`. You may also use one of the other provided types or create your own.
                 *
                 * ##### Example
                 *
                 *     var pipeline = aerogear.pipeline();
                 *
                 *     // Add a single pipe using the default adapter
                 *     pipeline = pipeline.add( "tasks" );
                 *
                 *     // Add multiple pipes using the default adapter
                 *     pipeline = pipeline.add( [ "tags", "projects" ] );
                 *
                 **/
                add: function( pipe ) {
                    var i,
                        current;

                    if ( !pipe ) {
                        return this;
                    } else if ( typeof pipe === "string" ) {
                        // pipe is a string so use
                        this.pipes[ pipe ] = aerogear.pipeline.adapters.rest( pipe, "id" );
                    } else if ( isArray( pipe ) ) {
                        // pipe is an array so loop through each item in the array
                        for ( i = 0; i < pipe.length; i++ ) {
                            current = pipe[ i ];

                            if ( typeof current === "string" ) {
                                this.pipes[ current ] = aerogear.pipeline.adapters.rest( current );
                            } else {
                                this.pipes[ current.name ] = aerogear.pipeline.adapters[ current.type || "rest" ]( current.name, current.recordId || "id", current.settings || {} );
                            }
                        }
                    } else {
                        // pipe is an object so use that signature
                        this.pipes[ pipe.name ] = aerogear.pipeline.adapters[ pipe.type || "rest" ]( pipe.name, pipe.recordId || "id", pipe.settings || {} );
                    }

                    return this;
                },
                /**
                 * aerogear.pipeline#remove( pipe ) -> Object
                 * - pipe (Mixed): This can be a variety of types specifying the pipe to remove as illustrated below
                 *
                 * When passing a pipeConfiguration object to `remove`, the following items can be provided:
                 *  - **name** - String (Required), the name that the pipe will later be referenced by
                 *  - **type** - String (Optional, default - "rest"), the type of pipe as determined by the adapter used
                 *  - **recordId** - String (Optional, default - "id"), the identifier used to denote the unique id for each record in the data associated with this pipe
                 *  - **settings** - Object (Optional, default - {}), the settings to be passed to the adapter
                 *   - Adapters may have a number of varying configuration settings.
                 *
                 * Returns the full pipeline object with the specified pipe(s) removed
                 *
                 *     // Remove a single pipe using the default configuration (rest).
                 *     aerogear.pipeline.remove( String pipeName );
                 *
                 *     // Remove multiple pipes all using the default configuration (rest).
                 *     aerogear.pipeline.remove( Array[String] pipeNames );
                 *
                 *     // Remove one or more pipe configuration objects.
                 *     aerogear.pipeline.remove( Object/Array[Object] pipeConfigurations )
                 *
                 * ##### Example
                 *
                 *     var pipeline = aerogear.pipeline( [ "projects", "tags", "tasks" ] );
                 *
                 *     // Remove a single pipe
                 *     pipeline.remove( "tasks" );
                 *
                 *     // Remove multiple pipes using the default adapter
                 *     pipeline.remove( [ "tags", "projects" ] );
                 *
                 **/
                remove: function( pipe ) {
                    var i,
                        current;

                    if ( typeof pipe === "string" ) {
                        // pipe is a string so use
                        delete this.pipes[ pipe ];
                    } else if ( isArray( pipe ) ) {
                        // pipe is an array so loop through each item in the array
                        for ( i = 0; i < pipe.length; i++ ) {
                            current = pipe[ i ];

                            if ( typeof current === "string" ) {
                                delete this.pipes[ current ];
                            } else {
                                delete this.pipes[ current.name ];
                            }
                        }
                    } else if ( pipe ) {
                        // pipe is an object so use that signature
                        delete this.pipes[ pipe.name ];
                    }

                    return this;
                }
            };

        return pipeline.add( pipe );
    };

    /**
     * aerogear.pipeline.adapters
     *
     * The adapters object is provided so that adapters can be added to the aerogear.pipeline namespace dynamically and still be accessible to the add method
     **/
    aerogear.pipeline.adapters = {};
})( aerogear );