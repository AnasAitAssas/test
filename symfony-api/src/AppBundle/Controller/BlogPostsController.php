<?php

namespace AppBundle\Controller;

use AppBundle\Form\BlogPostType;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\View\View;
use FOS\RestBundle\Controller\Annotations;
use FOS\RestBundle\View\RouteRedirectView;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Routing\ClassResourceInterface;
use FOS\RestBundle\Controller\Annotations\RouteResource;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;

/**
 *
 * @RouteResource("post")
 */
class BlogPostsController extends FOSRestController implements ClassResourceInterface
{
    private function getBlogPostRepository()
    {
        return $this->get('AppBundle.BlogPostRepository');
    }
    
    /**
     * Gets an individual BlogPost
     *
     * @param int $id
     * @return mixed
     * @throws \Doctrine\ORM\NoResultException
     * @throws \Doctrine\ORM\NonUniqueResultException
     *
     * @ApiDoc(
     *     output="AppBundle\Entity\BlogPost",
     *     statusCodes={
     *         200 = "Returned when successful",
     *         404 = "Return when not found"
     *     }
     * )
     */
    public function getAction(int $id){
        $blogPost = null;
        
        try{
            $blogPost =  $this->getBlogPostRepository()->createFindOneByIdQuery($id)->getSingleResult();
        }catch(\Exception $e){
            if ($blogPost === null) {
                return new View(null, Response::HTTP_NOT_FOUND);
            }
        }

        return $blogPost;
    }
    
    /**
     * Gets a collection of BlogPosts
     *
     * @return array
     *
     * @ApiDoc(
     *     output="AppBundle\Entity\BlogPost",
     *     statusCodes={
     *         200 = "Returned when successful",
     *         404 = "Return when not found"
     *     }
     * )
     */
    public function cgetAction()
    {
        return $this->getBlogPostRepository()->createFindAllQuery()->getResult();
    }
    
    /**
     * Creates a new BlogPost
     *
     * @param Request $request
     * @return View|\Symfony\Component\Form\Form
     *
     * @ApiDoc(
     *     input="AppBundle\Form\Type\BlogPostType",
     *     output="AppBundle\Entity\BlogPost",
     *     statusCodes={
     *         201 = "Returned when a new BlogPost has been successful created",
     *         404 = "Return when not found"
     *     }
     * )
     */
    public function postAction(Request $request)
    {
        $form = $this->createForm(BlogPostType::class, null, [
            'csrf_protection' => false,        
        ]);
        
        $form->submit($request->request->all());
        
        if (!$form->isValid()) {
            return $form;
        }

        $blogPost = $form->getData();
        
        $em = $this->getDoctrine()->getManager();
        $em->persist($blogPost);
        $em->flush();
        
        $routeOptions = [
            'id' => $blogPost->getId(),
            '_format' => $request->get('_format'),
        ];
        
        return $this->routeRedirectView('get_post', $routeOptions, Response::HTTP_CREATED);
    }
    
    /**
     * Updates an existing BlogPost
     *
     * @param Request $request
     * @param int     $id
     * @return View|\Symfony\Component\Form\Form
     *
     * @ApiDoc(
     *     input="AppBundle\Form\Type\BlogPostType",
     *     output="AppBundle\Entity\BlogPost",
     *     statusCodes={
     *         204 = "Returned when an existing BlogPost has been successful updated",
     *         400 = "Return when errors",
     *         404 = "Return when not found"
     *     }
     * )
     */
    public function putAction(Request $request, int $id)
    {
        $blogPost = $this->getBlogPostRepository()->find($id);
        
        if ($blogPost === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }
        
        $form = $this->createForm(BlogPostType::class, $blogPost, [
            'csrf_protection' => false,
        ]);
        
        $form->submit($request->request->all());
        
        if (!$form->isValid()) {
            return $form;
        }
        
        $em = $this->getDoctrine()->getManager();
        $em->flush();
        
        $routeOptions = [
            'id' => $blogPost->getId(),
            '_format' => $request->get('_format'),
        ];
        
        return $this->routeRedirectView('get_post', $routeOptions, Response::HTTP_NO_CONTENT);
    }
    
    /**
     * Updates an existing BlogPost
     *
     * @param Request $request
     * @param int     $id
     * @return View|\Symfony\Component\Form\Form
     *
     * @ApiDoc(
     *     input="AppBundle\Form\Type\BlogPostType",
     *     output="AppBundle\Entity\BlogPost",
     *     statusCodes={
     *         204 = "Returned when an existing BlogPost has been successful updated",
     *         400 = "Return when errors",
     *         404 = "Return when not found"
     *     }
     * )
     */
    public function patchAction(Request $request, int $id)
    {
        $blogPost = $this->getBlogPostRepository()->find($id);
        
        if ($blogPost === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }
        
        $form = $this->createForm(BlogPostType::class, $blogPost, [
            'csrf_protection' => false,
        ]);
        
        $form->submit($request->request->all(), false);
        
        if (!$form->isValid()) {
            return $form;
        }
        
        $em = $this->getDoctrine()->getManager();
        $em->flush();
        
        $routeOptions = [
            'id' => $blogPost->getId(),
            '_format' => $request->get('_format'),
        ];
        
        return $this->routeRedirectView('get_post', $routeOptions, Response::HTTP_NO_CONTENT);
    }
    
    /**
     * Deletes a BlogPost
     *
     * @param int $id
     * @return View
     *
     * @ApiDoc(
     *     statusCodes={
     *         204 = "Returned when an existing BlogPost has been successful deleted",
     *         404 = "Return when not found"
     *     }
     * )
     */
    public function deleteAction(int $id)
    {
        $blogPost = $this->getBlogPostRepository()->find($id);
        
        if ($blogPost === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }
        
        $em = $this->getDoctrine()->getManager();
        $em->remove($blogPost);
        $em->flush();
        
        return new View(null, Response::HTTP_NO_CONTENT);
    }
}