// src/config/withRouter.js
// import { useNavigate, useParams, useLocation } from 'react-router-dom';

// export function withRouter(Component) {
//     function ComponentWithRouterProp(props) {
//         let navigate = useNavigate();
//         let params = useParams();
//         let location = useLocation();
//         return (
//             <Component
//                 {...props}
//                 navigate={navigate}
//                 params={params}
//                 location={location}
//             />
//         );
//     }
//
//     return ComponentWithRouterProp;
// }


// src/config/withRouter.js
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export function withRouter(Component) {
    return function WrapperComponent(props) {
        const navigate = useNavigate();
        const location = useLocation();
        const params = useParams();
        return <Component {...props} navigate={navigate} location={location} params={params} />;
    };
}
